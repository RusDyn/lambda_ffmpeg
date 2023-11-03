import {execFile} from 'child_process';

import {FFMPEG_ARGS, outputDir} from './utils'
import path = require('path');
export const execFileAsync = (file: string, args: string[], opts: any) => {
    return new Promise((resolve, reject) => {
      execFile(file, args, opts, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({stdout, stderr});
        }
      });
    });
  }


export async function ffmpeg_run(args: string[]){
    
    const opts = {cwd: outputDir}
    try {
      const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
      //console.log('ffmpeg path:', ffmpeg);
      //process.exit(7);
     const result = await execFileAsync(ffmpeg, args, opts);
      console.log(result);
      //process.exit(7);
    
    }
    catch (err) {
        console.log(err);
        if (err.stderr) {
          console.log('FFmpeg Error: --------------------------');
          console.error(err.stderr); // Log FFmpeg's stderr for error details
        }
        process.exit(1);
    }
}

/**
 * Runs the FFmpeg executable
 *
 * @param {string} keyPrefix - The prefix for the key (filename minus extension)
 * @returns {Promise}
 */
export async function ffmpeg(keyPrefix: string): Promise<void> {
    console.log('Starting FFmpeg');
  
    const args = [
        '-y',
        '-loglevel',
        'warning',
        '-i',
        '../download',
        ...FFMPEG_ARGS.replace('$KEY_PREFIX', keyPrefix).split(' '),
      ];

    await ffmpeg_run(args)
    
  }
  
  