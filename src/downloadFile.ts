import { Readable } from "stream";
import * as fs from 'fs';
import { download, s3 } from "./utils";

/**
 * Creates a readable stream from an S3 Object reference
 */
export async function downloadFile(Bucket: string, Key: string): Promise<string> {
    const {Body} = await s3.getObject({Bucket, Key});
  
    return await new Promise<string>((resolve, reject) => {
      (Body as Readable)
        .pipe(fs.createWriteStream(download))
        .on('error', err => reject(err))
        .on('close', () => resolve(download));
    });
  }
  