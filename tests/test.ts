process.env.PROCESSED_BUCKET = 'yfactory-public';

import { handler } from '../main';
import { copyVideoToLocal } from '../src/createPartOfVideo';
import { ffprobe } from '../src/ffprobe';







let start = new Date().getTime();
import data from './data';

const { styles, audios, videos, words } = data;
export const event = {
  duration: 10.1,
  width: 320,
  height: 180,
  styles,
  audios,
  videos,
  words,
};

handler(event).then((e) => {
  const { body } = e;
  const r = JSON.parse(body);
  const { name } = r;
  const url = `https://s3.eu-north-1.amazonaws.com/yfactory-public/${name}.mp4`;
  console.log(url);
  console.log('handler took:', Math.round((new Date().getTime() - start) / 1000), 'secs');
  console.log(`Expected duration: ${event.duration}`)
}).catch(console.error);
