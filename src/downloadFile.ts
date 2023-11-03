import { Readable } from "stream";
import * as fs from 'fs';
import { s3, tempDir } from "./utils";
import path = require("path");

/**
 * Creates a readable stream from an S3 Object reference
 */
export async function downloadFile(Bucket: string, Key: string): Promise<string> {
    const {Body} = await s3.getObject({Bucket, Key});
  
    const randomString = Math.random().toString(36).substring(7);
    const download = path.join(tempDir, 'download' + randomString);
  
    return await new Promise<string>((resolve, reject) => {
      (Body as Readable)
        .pipe(fs.createWriteStream(download))
        .on('error', err => reject(err))
        .on('close', () => resolve(download));
    });
  }
  