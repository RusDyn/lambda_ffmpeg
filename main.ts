import * as util from 'util';

import { removeFile, } from './src/utils'


import { downloadFile } from './src/downloadFile'
import { uploadFile } from './src/uploadFIle'

import { generateSubtitles } from './src/generateSubtitles'
import { mergeStreams } from './src/mergeStreams'
import { mergeStreamsWithFilelist } from './src/mergeStreamsWithFilelist'

/**
 * The Lambda Function handler
 */
export const handler = async event => {
  console.log(util.inspect(event, { depth: 10 }));

  //await ffmpeg_run(['-version']);

  const { words, audio, videos, video, styles = [{ font: "Arial", size: 32 }], duration = 150 } = event as {
    words: Array<{ word, start, end }>,
    audio: { bucket: string, name: string },
    videos?: Array<{ url, start, end }>,
    video?: { bucket: string, name: string },
    duration?: number,
    width?: number,
    height?: number,
    styles: Array<{ size?: number, font?: string }>
  };
  if (!words || words.length === 0) {
    throw new Error('No words is provided');
  }
  if (!audio || !audio.bucket || !audio.name) {
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

  console.log('Downloading audio')
  const audioFileName = await downloadFile(audio.bucket, audio.name);

  console.log('generateSubtitles')
  const subtitlesFile = generateSubtitles(words, duration, styles);

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

  console.log('Uploading finished file to S3 from', outName)
  const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const fileName = `out_${randomName}`;
  await uploadFile(fileName, outName)

  console.log('Removing temp files')
  await removeFile(subtitlesFile);
  await removeFile(audioFileName);


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
