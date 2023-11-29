
import * as path from 'path';

import {tempDir} from './utils'
import { ffmpeg_run } from './ffmpeg';
import { ffprobe } from './ffprobe';

export async function copyVideoToLocal(url: string){
  //const ffmpegPath = getFFmpegPath()
  const randomHex = Math.random().toString(16).substring(2, 8);
  const randomFileName = path.join(tempDir, `video_${randomHex}.mp4`);
  const args1 = ['-i', url, '-c', 'copy', randomFileName];
  await ffmpeg_run(args1);
  //await execFileAsync(ffmpegPath, args1);
  return randomFileName;
}
export async function createPartOfVideo(
  url: string,
  start: number,
  end: number,
) {
  
  
  const randomHex2 = Math.random().toString(16).substring(2, 8);
  
  const randomFileName2 = path.join(tempDir, `video_${randomHex2}.mp4`);
  
  const {streams} = await ffprobe(url);
  const {duration, r_frame_rate, avg_frame_rate} = streams[0];
  //console.log(duration, r_frame_rate, avg_frame_rate);
  //return randomFileName2;
  
  const framesArgs = r_frame_rate == '25/1' ? [
    '-c', 'copy', '-an'
  ] : [
    '-r',
    '25',
    '-c:v',
    'libx264',
    '-an',
    '-preset',
    'fast',
  ]
  const args2 = [
    '-loglevel',
    'debug',
    '-ss',
    start.toString(),
    '-to',
    end.toString(),
    '-i',
    url,
    '-force_key_frames',
    '0',
    ...framesArgs,
    randomFileName2,
    '-y',
  ];
  await ffmpeg_run(args2);
  return randomFileName2;
}
