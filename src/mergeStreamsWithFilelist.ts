import * as fs from 'fs';
//import {getReadableStream, outputDir, streamToBuffer, tempDir} from './utils';
import { outputDir } from './utils';
import { ffmpeg_run } from './ffmpeg';
import * as path from 'path';
import { generateFilesForList, writeFilelist } from './generateFilelist';

export async function mergeStreamsWithFilelist(
  audioName: string,
  videos: Array<{ url; start; end }>,
  subsFile?: string,
  duration: number = 60,
): Promise<string> {
  let filelist: Array<{ url, start, end }> = []
  filelist = await generateFilesForList(videos);
  console.log('filelist', filelist)
  const fileListPath = await writeFilelist(filelist);
  try {
    const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileFullPath = path.join(outputDir, `out_${randomName}.mp4`);

    const audioFilePath = audioName;

    console.log("Merging streams with filelist");
    console.log(fs.readFileSync(fileListPath).toString());
    //process.exit(0);
    const subtitlesArgs = subsFile ? [`-vf`, `ass=${subsFile}`] : [];
    const args = [
      '-loglevel',
      '32',
      '-hide_banner',
      '-f',
      'concat',
      '-safe', '0',
      '-i',
      fileListPath,
      '-i',
      audioFilePath,
      ...subtitlesArgs,
      '-map',
      '0:v',
      '-map',
      '1:a',
      //'0:v',
      '-c:v',
      'libx264',
      '-c:a',
      'copy',
      '-preset', 'veryfast',
      '-threads',
      'auto',
      '-t',
      duration.toString(), // specifies the duration; FFmpeg will stop processing after this duration
      fileFullPath,
      '-y',
    ];

    console.log('ffmpegProcess starting. output file: ', fileFullPath);
    console.log(await ffmpeg_run(args));


    return fileFullPath;

  } catch (error) {
    console.error('Error from FFmpeg:', error);
    throw new Error(`FFmpeg exited with error: ${error.message}`);
  }
  finally {
    for (const item of filelist) {
      if (fs.existsSync(item.url)) {
        fs.unlinkSync(item.url);
      }
    }
  }
}