import * as fs from "fs";
import { downloadFile } from "./downloadFile";
import { execAsync } from "./utils";

export async function getDuration(filePath) {
    try {
      const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${filePath}`;
      const { stdout } = await execAsync(cmd);
      return Math.round(parseFloat(stdout.trim()) * 100) / 100;
    } catch (error) {
      if (error.message.includes('Protocol not found') && filePath.startsWith('https://')) {
        // get bucket from url
        const bucket = filePath.split('/')[3];
        // get key from url
        const key = filePath.split('/').slice(4).join('/');
        console.log('Downloading file from s3', bucket, key);
        const path = await downloadFile(bucket, key);
        const duration = await getDuration(path);
        fs.unlinkSync(path);
        return duration;
      }
      throw new Error('Error get duration: ' + error.message + " - " + filePath);
    }
  }