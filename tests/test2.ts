process.env.PROCESSED_BUCKET = 'yfactory-public';

import { handler } from '../main';
import { getDuration } from '../src/getDuration';
import { mergeAudio } from '../src/mergeAudio';
import { currentPath } from '../src/utils';

let start = new Date().getTime();
import data from './data';

const { audios } = data;
async function test() {
  console.log(audios);
  const result = await mergeAudio(audios, 60, currentPath + '/test_merge_audio.mp3');
  console.log(result);
  const d = await getDuration(result);
  console.log(d);
}
test();