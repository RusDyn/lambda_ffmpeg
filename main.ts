import * as util from 'util';

import { removeFile, } from './src/utils'


import { downloadFile } from './src/downloadFile'
import { uploadFile } from './src/uploadFIle'

import { generateSubtitles } from './src/generateSubtitles'
import { mergeStreams } from './src/mergeStreams'
import { mergeStreamsWithFilelist } from './src/mergeStreamsWithFilelist'
import { mergeAudio } from './src/mergeAudio'
/**
 * The Lambda Function handler
 */
export const handler = async event => {
  console.log(util.inspect(event, { depth: 10 }));

  //await ffmpeg_run(['-version']);

  const { words, audios, videos, video, duration = 150, textColor = {
    spokenColor: 'FFFFFF',
    spokenAlpha: 60,
    currentColor: 'FFFFFF',
  } } = event as {
    words: Array<{ word, start, end }>,
    //    audio: { bucket: string, name: string },
    audios?: Array<{ url, start, end }>,
    videos?: Array<{ url, start, end }>,
    video?: { bucket: string, name: string },
    duration?: number,
    width?: number,
    height?: number,
    styles: Array<{ size?: number, font?: string }>
    textColor?: {
      spokenColor: string,
      spokenAlpha: number,
      currentColor: string,
    },
  };
  let styles = event.styles as Array<{ font: string, size: number }>;
  if (!styles || styles.length === 0) {
    styles = [{ font: "Arial", size: 32 }];
  }
  if (!words || words.length === 0) {
    throw new Error('No words is provided');
  }
  if (!audios) {
    throw new Error('No audio is provided. Should be {bucket: string, name: string}');
  }
  if (event.videos) {

  }
  else if (!video || !video.bucket || !video.name) {
    throw new Error('No video is provided. Should be {bucket: string, name: string}');
  }

  for (const word of words) {
    const { start, end, word: w } = word;
    if (!w || isNaN(start) || isNaN(end) || start < 0 || end < 0 || start > end) {
      throw new Error(`Invalid word format: ${JSON.stringify(word)}. Should be {word: string, start: number, end: number}`);
    }
  }

  console.log(styles);

  console.log('Downloading audio')


  for (let i = 0; i < audios.length; i++) {
    const audio = audios[i];
    const { url } = audio;
    const audioFileName = await downloadFile("", url);
    audios[i].url = audioFileName;
  }

  console.log('generateSubtitles')
  const { spokenColor, spokenAlpha, currentColor } = textColor;

  const subtitlesFile = generateSubtitles(words, duration, styles, spokenColor, spokenAlpha, currentColor);
  const audioFileName = await mergeAudio(audios, duration);

  for (let i = 0; i < audios.length; i++) {
    const audio = audios[i];
    const { url } = audio;
    await removeFile(url);
  }

  let outName = "";
  try {
    if (videos) {
      console.log('mergeStreamsWithFilelist');
      outName = await mergeStreamsWithFilelist(audioFileName, videos, subtitlesFile, duration);
    }
    else {
      const videoFileName = await downloadFile(video.bucket, video.name);
      outName = await mergeStreams(audioFileName, videoFileName, subtitlesFile, duration);
      await removeFile(videoFileName);
    }
  } catch (e) {
    console.error(e);
    throw new Error('Error in function while merging streams: ' + e.message);
  }

  //console.log('Uploading finished file to S3 from', outName)
  const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const fileName = `out_${randomName}`;

  await uploadFile(fileName, outName)

  console.log('Removing temp files')
  await removeFile(subtitlesFile);
  await removeFile(audioFileName);

  //await removeFile(outName);


  //await addHashForNewFile(path.join(outputDir, 'out.mp4'), sourceLocation.key);
  //await Promise.all([uploadFiles(keyPrefix)]);

  /*
  const sourceLocation = getFileLocation(event);
  const keyPrefix = sourceLocation.key.replace(/\.[^/.]+$/, '');
 
  const s3Record = event.Records[0].s3;
 
  const name = await downloadFile(s3Record.bucket.name, s3Record.object.key);
  checkM3u(name);
  await ffprobe();
  await confirmUpload(name);
  await ffmpeg(keyPrefix);
  removeFile(name);
  await addHashForNewFile(path.join(outputDir, 'out.mp4'), sourceLocation.key);
  await Promise.all([uploadFiles(keyPrefix)]);*/
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success',
      name: fileName,
    }),
  }
};
