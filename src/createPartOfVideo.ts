
import * as path from 'path';
import * as fs from 'fs';

import { tempDir } from './utils'
import { ffmpeg_run } from './ffmpeg';
import { ffprobe } from './ffprobe';
import { getDuration } from './getDuration';

export async function copyVideoToLocal(url: string) {
  //const ffmpegPath = getFFmpegPath()
  const randomHex = Math.random().toString(16).substring(2, 8);
  const urlName = path.basename(url);
  const randomFileName = path.join(tempDir, urlName);
  if (fs.existsSync(randomFileName)) {
    return randomFileName;
  }
  const args1 = ['-i', url, '-c', 'copy', randomFileName];
  await ffmpeg_run(args1);
  //await execFileAsync(ffmpegPath, args1);
  return randomFileName;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = sec.toString().padStart(2, '0');
  const paddedMilliseconds = milliseconds.toString().padStart(3, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`;
}

export async function createPartOfVideo(
  url: string,
  start: number,
  end: number,
) {




  const urlName = path.basename(url);
  const randomFileName2 = path.join(tempDir, `part_${urlName}`);

  const { streams } = await ffprobe(url);
  const { duration, r_frame_rate, avg_frame_rate } = streams[0];

  const is25fps = r_frame_rate === '25/1';
  const copyArgs = [
    '-c', 'copy'
  ];
  const changeFpsArgs = ['-r', '25', '-c:v', 'libx264', '-preset', 'fast'];
  //console.log(is25fps)
  const codecArgs = is25fps ? copyArgs : changeFpsArgs;
  const fs = formatTime(start);
  const fe = formatTime(end);
  const args2 = [
    '-loglevel', 'debug',
    '-accurate_seek',
    '-ss', fs,
    '-to', fe,
    '-i',
    url,
    ...changeFpsArgs,
    '-an',
    '-force_key_frames', `${fs},${fe}`,
    randomFileName2,
    '-y',
  ];
  await ffmpeg_run(args2);
  return randomFileName2;
}
