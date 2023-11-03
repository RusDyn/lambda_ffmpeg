import {handler} from './main';
import {Context} from 'aws-lambda';

const event = {
  "audio": {
    "bucket": "yfactory-public",
    "name": "bert.mp3"
  },
  "video": {
    "bucket": "yfactory-public",
    "name": "bert.mp4"
  },
  "words": [
    {
      "start": 0,
      "end": 3,
      "word": "Hello"
    },
    {
      "start": 3,
      "end": 6,
      "word": "world"
    }
  ],
  "duration": 1900
};

handler(event);
