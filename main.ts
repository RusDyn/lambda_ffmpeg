import * as util from 'util';

import {removeFile, } from './src/utils'


import {downloadFile} from './src/downloadFile'
import {confirmUpload, uploadFile} from './src/uploadFIle'
import {addHashForNewFile} from './src/addHashForNewFile'

import {generateSubtitles} from './src/generateSubtitles'
import {mergeStreams} from './src/mergeStreams'
import { ffmpeg_run } from './src/ffmpeg';

/**
 * The Lambda Function handler
 */
export const handler = async event => {
  console.log(util.inspect(event, {depth: 10}));

  await ffmpeg_run(['-version']);
  
  const words = event.words;
  if (!words || words.length === 0) {
    throw new Error('No words is provided');
  }
  const audio = event.audio;
  if (!audio || !audio.bucket || !audio.name) {
    throw new Error('No audio is provided. Should be {bucket: string, name: string}');
  }
  const video = event.video;
  if (!video || !video.bucket || !video.name) {
    throw new Error('No video is provided. Should be {bucket: string, name: string}');
  }
  const duration = event.duration || 120;
  
  const audioFileName = await downloadFile(audio.bucket, audio.name);
  const videoFileName = await downloadFile(video.bucket, video.name);
  const subtitlesFile = generateSubtitles(words, duration);
  
  const outName = await mergeStreams(audioFileName, videoFileName, subtitlesFile, duration);

  console.log('Uploading file to S3 from', outName)
  await uploadFile('out', outName)
  
  console.log('Removing temp files')
  await removeFile(subtitlesFile);
  await removeFile(audioFileName);
  await removeFile(videoFileName);

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
};
