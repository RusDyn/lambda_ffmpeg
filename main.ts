
import * as path from 'path';
import * as util from 'util';

import {
  checkM3u, getFileLocation, outputDir, removeFile, } from './src/utils'

import {S3Handler} from 'aws-lambda';
import {downloadFile} from './src/downloadFile'
import {confirmUpload, uploadFiles} from './src/uploadFIle'
import {ffprobe} from './src/ffprobe'
import {ffmpeg} from './src/ffmpeg'
import {addHashForNewFile} from './src/addHashForNewFile'



/**
 * The Lambda Function handler
 */
export const handler: S3Handler = async event => {
  console.log(util.inspect(event, {depth: 10}));
  const sourceLocation = getFileLocation(event);
  const keyPrefix = sourceLocation.key.replace(/\.[^/.]+$/, '');

  const s3Record = event.Records[0].s3;

  const name = await downloadFile(s3Record.bucket.name, s3Record.object.key);
  checkM3u(name);
  await ffprobe();
  await confirmUpload(name);
  await ffmpeg(keyPrefix);
  removeFile(name);
  await addHashForNewFile(path.join(outputDir, 'out.mp4'), sourceLocation.key);
  await Promise.all([uploadFiles(keyPrefix)]);
};
