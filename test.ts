process.env.PROCESSED_BUCKET = 'yfactory-public';

import { handler } from './main';


const words: Array<{ start, end, word }> = [
  { word: 'Feel', start: 0, end: 0.4 },
  { word: 'that', start: 0.4, end: 0.5 },
  { word: 'tightness', start: 0.5, end: 0.9 },
  { word: 'in', start: 0.9, end: 1.2 },
  { word: 'your', start: 1.2, end: 1.2 },
  { word: 'chest.', start: 1.2, end: 1.4 }
]


const videos: Array<{ url, start, end }> = [
  {
    end: 1.4,
    start: 0,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_4367441_320_180.mp4'
  },
  {
    end: 5.8,
    start: 1.4,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_11494045_320_180.mp4'
  },
  {
    end: 10,
    start: 5.8,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592718_320_180.mp4'
  },
  {
    end: 13.1,
    start: 10,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592934_320_180.mp4'
  },
  {
    end: 18,
    start: 13.1,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594464_320_180.mp4'
  },
  {
    end: 20.5,
    start: 18,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7578632_320_180.mp4'
  },
  {
    end: 23.8,
    start: 20.5,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8502827_320_180.mp4'
  },
  {
    end: 25.4,
    start: 23.8,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8997517_320_180.mp4'
  },
  {
    end: 28.1,
    start: 25.4,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7812579_320_180.mp4'
  },
  {
    end: 31.3,
    start: 28.1,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8795165_320_180.mp4'
  },
  {
    end: 33.6,
    start: 31.3,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6593639_320_180.mp4'
  },
  {
    end: 38,
    start: 33.6,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5726621_320_180.mp4'
  },
  {
    end: 42.3,
    start: 38,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6799148_320_180.mp4'
  },
  {
    end: 45.7,
    start: 42.3,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594705_320_180.mp4'
  },
  {
    end: 49.6,
    start: 46.5,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7424133_320_180.mp4'
  },
  {
    end: 53.2,
    start: 49.6,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7658644_320_180.mp4'
  },
  {
    end: 56.6,
    start: 53.2,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5726628_320_180.mp4'
  },
  {
    end: 59.8,
    start: 56.6,
    url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594473_320_180.mp4'
  }
];




const event = {
  duration: 60,
  width: 320,
  height: 180,
  styles: [{ font: 'Arial', size: 32 }],
  audio: {
    bucket: 'yfactory-public',
    name: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/audio_40.mp3'
  },
  videos,
  "words": words,
};

handler(event).then((e) => {
  const { body } = e;
  const r = JSON.parse(body);
  const { name } = r;
  const url = `https://s3.eu-north-1.amazonaws.com/yfactory-public/${name}.mp4`;
  console.log(url);
}).catch(console.error);
