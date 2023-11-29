import { Readable } from "stream";
import * as fs from 'fs';
import { s3, streamToBuffer, tempDir } from "./utils";
import path = require("path");

/**
 * Creates a readable stream from an S3 Object reference
 */
export async function downloadFile(Bucket: string, Key: string): Promise<string> {

  // https://yfactory-public.s3.eu-north-1.amazonaws.com/audio_1.mp3
  if (Key.startsWith('https://s3')) {

    const url = new URL(Key);
    const pathname = url.pathname.slice(1);
    const [b, k] = pathname.split('/', 2);
    Bucket = b;
    Key = k;
  }
  else if (Key.startsWith('http') && Key.includes('s3.')) {
    const url = new URL(Key);
    Bucket = url.host.split('.')[0];
    Key = url.pathname.slice(1);
  }
  console.log('Download file', Bucket, Key)
  const { Body } = await s3.getObject({ Bucket, Key });

  const randomString = Math.random().toString(36).substring(7);
  const downloadPath = path.join(tempDir, 'download' + randomString);

  const buffer = await streamToBuffer(Body as Readable);
  fs.writeFileSync(downloadPath, buffer);
  return downloadPath;
}
