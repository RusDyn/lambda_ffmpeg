
import { FFMPEG_ARGS, execFileAsync, getFFmpegPath, outputDir } from './utils'

export async function ffmpeg_run(args: string[]) {

  const opts = { cwd: outputDir }

  try {
    const result = await execFileAsync(getFFmpegPath(), args, opts);
    //console.log(result);
    //process.exit(7);

  }
  catch (err) {
    console.log(err);
    if (err.stderr) {
      console.log('FFmpeg Error: --------------------------');
      console.error(err.stderr); // Log FFmpeg's stderr for error details
    }
    throw err;
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

