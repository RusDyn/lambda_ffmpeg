import {S3} from '@aws-sdk/client-s3';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import * as os from 'os';
import * as fs from 'fs';
import {S3Event} from 'aws-lambda';
import path = require('path');
import { Readable } from 'stream';
import axios from 'axios';

type env = {
    PROCESSED_BUCKET: string;
    FFMPEG_ARGS: string;
    MIME_TYPES: string;
    VIDEO_MAX_DURATION: string;
    ENDPOINT_URL?: string;
    HASHES_TABLE: string;
  };
  
  export const {
    PROCESSED_BUCKET,
    FFMPEG_ARGS = "-c:a copy -vf scale='min(320\\,iw):-2' -movflags +faststart out.mp4 -vf thumbnail -vf scale='min(320\\,iw):-2' -vframes 1 out.png",
    MIME_TYPES = '{"png":"image/png","mp4":"video/mp4"}',
    VIDEO_MAX_DURATION = '120',
    ENDPOINT_URL,
    HASHES_TABLE,
  } = process.env as env;
  
  const opts = ENDPOINT_URL ? {endpoint: ENDPOINT_URL} : {};
  
  export const s3 = new S3(opts);
  export const docClient = new DynamoDBClient({});
  
  export const tempDir = os.tmpdir();
  export const download = path.join(tempDir, 'download');
  console.log('Download dir:', download);
  const currentPath = process.cwd();
console.log("Current working directory:", currentPath);

  export const outputDir = path.join(tempDir, 'outputs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

export const mimeTypes = JSON.parse(MIME_TYPES);
export const videoMaxDuration = +VIDEO_MAX_DURATION;
const extensionRegex = /\.(\w+)$/;

export function getExtension(filename: string) {
  return filename.match(extensionRegex)[1];
}


export function checkM3u(file: string) {
  const fileContents = fs.readFileSync(file).toString();

  if (/^#EXT/g.test(fileContents)) {
    throw new Error('File looks like an M3U, bailing out');
  }
}

/**
 * Normalizes the location of a cloud storage object for S3
 */
export function getFileLocation({
  Records: [
    {
      s3: {bucket, object},
    },
  ],
}: S3Event): {bucket: string; key: string} {
  return {
    bucket: bucket.name,
    key: decodeURIComponent(object.key).replace(/\+/g, ' '),
  };
}

/**
 * Deletes a file
 *
 * @param {!string} localFilePath - The location of the local file
 */
export function removeFile(localFilePath: string) {
  console.log(`Deleting ${localFilePath}`);

  fs.unlinkSync(localFilePath);
}

export async function getReadableStream(url) {
  if (
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('ftp://')
  ) {
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    return response.data;
  } else {
    const fileStream = fs.createReadStream(url);
    return fileStream;
  }
}

export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

  