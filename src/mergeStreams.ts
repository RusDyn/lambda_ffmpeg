import * as fs from 'fs';
import {outputDir} from './utils';
import {ffmpeg_run} from './ffmpeg';
import * as path from 'path';

export async function mergeStreams(
    audioName: string,
    videoName: string,
    subsFile?: string,
    duration: number = 60,
  ): Promise<string> {
    try {
      //const video = await getReadableStream(videoName);
      //const audio = await getReadableStream(audioName);
      //const audioBuffer = await streamToBuffer(audio);
      //const videoBuffer = await streamToBuffer(video);
  
      const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const fileFullPath = path.join(outputDir,`out_${randomName}.mp4`);

      // Write buffers to temporary files
      //const audioFilePath = path.join(tempDir, 'temp_audio_input');
      //const videoFilePath = path.join(tempDir, 'temp_video_input');
      //fs.writeFileSync(audioFilePath, audioBuffer);
      //fs.writeFileSync(videoFilePath, videoBuffer);
      const audioFilePath = audioName;
      const videoFilePath = videoName;
  
      //console.log(fs.readFileSync(subsFile, 'utf8'));
      console.log('Reading subtitles file:', subsFile, 'exists:', fs.existsSync(subsFile));
      console.log('Video file:', videoFilePath, 'exists:', fs.existsSync(videoFilePath));
      console.log('Audio file:', audioFilePath, 'exists:', fs.existsSync(audioFilePath));

      //console.log(await ffmpeg_run(['-i', audioFilePath]));
      //process.exit(0);
      const subtitlesArgs = subsFile ? [`-vf`, `ass=${subsFile}`] : [];
      const args = [
        '-loglevel',
        process.env.DEBUG_LEVEL || '32',
        '-hide_banner',
        '-i',
        videoFilePath,
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
      //const { stdout, stderr } = await execFileAsync(ffmpegBinaryPath, args);
  
      // Handle FFmpeg's stdout and stderr if needed
      //if (stdout) console.log(stdout);
      //if (stderr) console.error(stderr);
  
      //console.log('ffmpegProcess done');
  
      // Cleanup temporary files
      
      //fs.unlinkSync(audioFilePath);
      //fs.unlinkSync(videoFilePath);

      return fileFullPath;

    } catch (error) {
      console.error('Error from FFmpeg:', error);
      throw new Error(`FFmpeg exited with error: ${error.message}`);
    }
  }