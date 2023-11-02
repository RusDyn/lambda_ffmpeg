import * as child_process from 'child_process';

import {tempDir, videoMaxDuration} from './utils'





/**
 * Runs FFprobe and ensures that the input file has a valid stream and meets the maximum duration threshold.
 */
export async function ffprobe(): Promise<void> {
    console.log('Starting FFprobe');
  
    return new Promise((resolve, reject) => {
      const args: string[] = [
        '-v',
        'quiet',
        '-print_format',
        'json',
        '-show_format',
        '-show_streams',
        '-i',
        'download',
      ];
      const opts = {
        cwd: tempDir,
      };
  
      const output = child_process.execSync(['ffprobe', ...args].join(' '), opts);
  
      const stdout = output.toString();
  
      console.log(stdout);
  
      const {streams, format} = JSON.parse(stdout);
  
      const hasVideoStream = streams.some(
        ({codec_type, duration}: {codec_type: string; duration: number}) =>
          codec_type === 'video' &&
          (duration || format.duration) <= videoMaxDuration
      );
  
      if (!hasVideoStream) {
        reject('FFprobe: no valid video stream found');
      } else {
        console.log('Valid video stream found. FFprobe finished.');
        resolve();
      }
    });
  }