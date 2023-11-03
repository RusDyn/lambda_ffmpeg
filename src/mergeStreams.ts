import * as fs from 'fs';
import {getReadableStream, outputDir, streamToBuffer, tempDir} from './utils';
import {ffmpeg_run} from './ffmpeg';
import path = require('path');

export async function mergeStreams(
    audioName: string,
    videoName: string,
    subsFile?: string,
    duration: number = 60,
  ): Promise<string> {
    try {
      const video = await getReadableStream(videoName);
      const audio = await getReadableStream(audioName);
      const audioBuffer = await streamToBuffer(audio);
      const videoBuffer = await streamToBuffer(video);
  
      const fileFullPath = path.join(outputDir,'out.mp4');

      // Write buffers to temporary files
      const audioFilePath = path.join(tempDir, 'temp_audio_input');
      const videoFilePath = path.join(tempDir, 'temp_video_input');
      fs.writeFileSync(audioFilePath, audioBuffer);
      fs.writeFileSync(videoFilePath, videoBuffer);
  
      console.log(fs.readFileSync(subsFile, 'utf8'));
      const subtitlesArgs = subsFile ? [`-vf`, `ass=${subsFile}`] : [];
      const args = [
        '-loglevel',
        'error',
        '-hide_banner',
        '-i',
        audioFilePath,
        '-i',
        videoFilePath,
        ...subtitlesArgs,
        '-map',
        '0:a',
        '-map',
        '1:v',
        //'0:v',
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-t',
        duration.toString(), // specifies the duration; FFmpeg will stop processing after this duration
        fileFullPath,
        '-y',
      ];
  
      console.log('ffmpegProcess starting. output file: ', fileFullPath);
      console.log(await ffmpeg_run(args));
      //const { stdout, stderr } = await execFileAsync(ffmpegBinaryPath, args);
  
      // Handle FFmpeg's stdout and stderr if needed
      //if (stdout) console.log(stdout);
      //if (stderr) console.error(stderr);
  
      //console.log('ffmpegProcess done');
  
      // Cleanup temporary files
      
      fs.unlinkSync(audioFilePath);
      fs.unlinkSync(videoFilePath);

      return fileFullPath;

    } catch (error) {
      console.error('Error from FFmpeg:', error);
      throw new Error(`FFmpeg exited with error: ${error.message}`);
    }
  }