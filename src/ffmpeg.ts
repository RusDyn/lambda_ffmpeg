import * as child_process from 'child_process';

import {FFMPEG_ARGS, outputDir} from './utils'





/**
 * Runs the FFmpeg executable
 *
 * @param {string} keyPrefix - The prefix for the key (filename minus extension)
 * @returns {Promise}
 */
export function ffmpeg(keyPrefix: string): Promise<void> {
    console.log('Starting FFmpeg');
  
    return new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-loglevel',
        'warning',
        '-i',
        '../download',
        ...FFMPEG_ARGS.replace('$KEY_PREFIX', keyPrefix).split(' '),
      ];
      const opts = {
        cwd: outputDir,
      };
  
      child_process
        .spawn('ffmpeg', args, opts)
        .on('message', msg => console.log(msg))
        .on('error', reject)
        .on('close', resolve);
    });
  }
  
  