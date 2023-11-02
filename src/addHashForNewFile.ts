import * as child_process from 'child_process';
import * as fs from 'fs';
import * as crypto from 'crypto';
import {HASHES_TABLE, docClient,} from './utils'

import {
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb';




export async function addHashForNewFile(file: string, id: string) {
    const hash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(file))
      .digest();
  
    const params: PutCommandInput = {
      TableName: HASHES_TABLE,
      Item: {
        hash,
        id,
        uploadPending: false,
        processed: true,
      },
    };
  
    await docClient.send(new PutCommand(params));
  }