
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {HASHES_TABLE, PROCESSED_BUCKET, docClient, getExtension, 
    mimeTypes, outputDir, removeFile, s3 } from './utils'

import {
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';



/**
 * Transforms, uploads, and deletes an output file
 */
export async function uploadFile(keyPrefix: string, filename: string) {
    const extension = getExtension(filename);
    const mimeType = mimeTypes[extension];
    const rmFiles = [filename];
  
    const Bucket = PROCESSED_BUCKET;
    const Key = `${keyPrefix}.${extension}`;
    const Body = fs.readFileSync(filename);
    console.log(`Uploading ${mimeType} - ${filename} to ${Bucket}/${Key}`);
  
    await s3.putObject({
      Bucket,
      Key,
      Body, 
      ContentType: mimeType,
      CacheControl: 'max-age=31536000',
    });
  
    console.log(`${mimeType} ${filename} complete.`);
  
    rmFiles.forEach(removeFile);
  }
  
  /**
   * Uploads the output files
   */
  export async function uploadFiles(keyPrefix: string) {
    return Promise.all(
      fs.readdirSync(outputDir).map(filename => uploadFile(keyPrefix, filename))
    );
  }
  
  export async function confirmUpload(file: string) {
    const hash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(file))
      .digest();
  
    const params: UpdateCommandInput = {
      TableName: HASHES_TABLE,
      Key: {
        hash,
      },
      UpdateExpression: 'set #0 = :0',
      ExpressionAttributeNames: {
        '#0': 'uploadPending',
      },
      ExpressionAttributeValues: {
        ':0': false,
      },
    };
  
    await docClient.send(new UpdateCommand(params));
  }
  