
import * as fs from 'fs';
import path = require('path');
import { outputDir, tempDir } from './utils';

export interface WordTime {
  word: string;
  start: number;
  end: number;
  style?: number;
}

export interface SubtitleStyle {
  size?: number;
  font?: string;
}

export interface SubtitleItem {
  //text: string;
  words: WordTime[];
}

export interface Subtitle {
  start: number;
  end: number;
  text: string;
  style?: number;
}

export function generateSubtitles(baseWords: WordTime[], maxStart: number, styles: SubtitleStyle[]) {
  const subtitles: Subtitle[] = [];
  const maxLength = 50;
  const baseLength = 10;

  let phrase = '';
  let start = 0;
  const wordsArray: WordTime[][] = [];
  for (let i = 0; i < baseWords.length; i += 1) {
    if (phrase !== '') {
      phrase += ' ';
    }
    phrase += baseWords[i].word;
    if (
      phrase.length > baseLength &&
      ['.', ',', '!', '?'].includes(phrase[phrase.length - 1])
    ) {
      wordsArray.push(baseWords.slice(start, i + 1));
      start = i + 1;
      phrase = '';
    } else if (phrase.length > maxLength) {
      wordsArray.push(baseWords.slice(start, i + 1));

      start = i + 1;
      phrase = '';
    }
  }

  if (phrase !== '') {
    wordsArray.push(baseWords.slice(start));
  }
  for (const words of wordsArray) {
    // Iterate through each word
    const words2: WordTime[] = [];
    // combine words with small duration
    if (words.length === 0) {
      continue;
    }

    let wordStart = words[0].start;
    let currenWord = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (currenWord !== '') {
        currenWord += ' ';
      }
      currenWord += word.word;
      if (i === words.length - 1) {
        words2.push({ word: currenWord, start: wordStart, end: word.end });
        break;
      } else if (word.end - wordStart > 0.1) {
        words2.push({ word: currenWord, start: wordStart, end: word.end });
        currenWord = '';
        wordStart = words[i + 1].start;
      }
    }
    for (let i = 0; i < words2.length; i++) {
      const word = words2[i];
      if (maxStart && word.start >= maxStart) {
        break;
      }
      let text = '';

      // Encapsulate each spoken word with an RGBA color tag, to make it slightly transparent
      const spokenWords = words2.slice(0, i);
      if (spokenWords.length > 0) {
        text += `{\\c&HFFFFFF&}{\\1a&H60&}${spokenWords
          .map((word) => word.word)
          .join(' ')}{\\c}{\\1a} `;
      }

      // Encapsulate the current spoken word with a color tag to make it fully white
      text += `{\\c&HFFFFFF&}${word.word}{\\c}`;

      // Add the words that have not yet been spoken. As the default 'fillColor' is null,
      // the text will be invisible, but reserve its space in the text element
      const unspokenWords = words2.slice(i + 1);
      if (unspokenWords.length) {
        const unspokenText = ` ${unspokenWords
          .map((word) => word.word)
          .join(' ')}`;
        text += `{\\1a&HFF&}{\\3a&HFF&}{\\4a&HFF&}${unspokenText}{\\4a}{\\3a}{\\1a}`;
      }

      // Create a keyframe for each spoken word
      const newItem = Object.assign({}, word, { text });
      subtitles.push(newItem);
    }
  }


  const ass = convertToAss(subtitles, styles);
  //console.log(ass);
  //process.exit();
  const randomFileName =
    'subs_' + Math.random().toString(36).substring(7) + '.ass';
  const fullPath = path.join(tempDir, randomFileName);
  fs.writeFileSync(fullPath, ass);
  return fullPath;
}

function convertToAss(subtitlesArray: Subtitle[], styles: SubtitleStyle[]) {

  // ASS file header
  let assContent = `[Script Info]
  ScriptType: v4.00+
  PlayResX: 384
  PlayResY: 288
  
  [V4+ Styles]
  Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
  `;


  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const i2: number = i + 1;
    const { font = 'Arial', size = 32 } = style;
    const str = [`Item${i2}`, font, size, "&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1"].join(',');
    assContent += `Style: ${str}\n`;

  }

  assContent += `
  
  [Events]
  Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

  let counter = 1;

  const convertToTime = (timeSeconds: number) => {
    return new Date(timeSeconds * 1000).toISOString().substr(11, 8) +
      '.' +
      new Date(timeSeconds * 1000).toISOString().substr(20, 2);
  }
  subtitlesArray.forEach((subtitle) => {
    const startTime = convertToTime(subtitle.start);
    const endTime = convertToTime(subtitle.end);
    // Convert color tags and construct the text
    // Add text and time to ASS content
    assContent += `Dialogue: 0,${startTime},${endTime},Item${subtitle.style || 1},,0,0,0,,${subtitle.text}\n`;
    counter++;
  });

  return assContent;
}
