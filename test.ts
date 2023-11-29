import {handler} from './main';


const words: Array<{start, end, word}> = []


const videos: Array<{url, start, end}> = []

const files = [
  'pexels_video_10159499_1280_720.mp4',
  'pexels_video_10187859_1280_720.mp4',
  'pexels_video_10189095_1280_720.mp4'
]
for (let i = 0; i < 30; i++) {
  words.push({
    start: i * 3,
    end: (i + 1) * 3,
    // random 5 letter word
    word: Math.random().toString(36).substring(2, 7)
  })
  videos.push({
    url: "https://yfactory-public.s3.eu-north-1.amazonaws.com/" + files[i % files.length],
    start: i * 4,
    end: (i + 1) * 4,
  })
}


const event = {
  "audio": {
    "bucket": "yfactory-public",
    "name": "bert.mp3"
  },
  "videos": [
    {
      end: 5.8,
      start: 0.4,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6278964_1280_720.mp4'
    },
    {
      end: 8.7,
      start: 5.8,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6597083_1280_720.mp4'
    },
    {
      end: 13.1,
      start: 8.7,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594463_1280_720.mp4'
    },
    {
      end: 15.8,
      start: 13.1,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5726626_1280_720.mp4'
    },
    {
      end: 18,
      start: 15.8,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_16935891_1280_720.mp4'
    },
    {
      end: 20.5,
      start: 18,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_978049_1280_720.mp4'
    },
    {
      end: 25.4,
      start: 20.5,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7801729_1280_720.mp4'
    },
    {
      end: 28.1,
      start: 25.4,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7801735_1280_720.mp4'
    },
    {
      end: 31.3,
      start: 28.1,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_3048882_1280_720.mp4'
    },
    {
      end: 33.6,
      start: 31.3,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6257973_1280_720.mp4'
    },
    {
      end: 36,
      start: 33.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7279039_1280_720.mp4'
    },
    {
      end: 38,
      start: 36,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7583993_1280_720.mp4'
    },
    {
      end: 42.3,
      start: 38,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6892652_1280_720.mp4'
    },
    {
      end: 45.7,
      start: 42.3,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6877510_1280_720.mp4'
    },
    {
      end: 48.7,
      start: 45.7,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5713014_1280_720.mp4'
    },
    {
      end: 53.2,
      start: 48.7,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_10472896_1280_720.mp4'
    },
    {
      end: 56.6,
      start: 53.2,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592934_1280_720.mp4'
    },
    {
      end: 61.8,
      start: 56.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6824306_1280_720.mp4'
    },
    {
      end: 64.3,
      start: 61.8,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_15295109_1280_720.mp4'
    },
    {
      end: 66.4,
      start: 64.3,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6824306_1280_720.mp4'
    },
    {
      end: 69.9,
      start: 66.4,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8371852_1280_720.mp4'
    },
    {
      end: 73.7,
      start: 69.9,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8015054_1280_720.mp4'
    },
    {
      end: 77.2,
      start: 73.7,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594467_1280_720.mp4'
    },
    {
      end: 79.9,
      start: 77.2,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5713009_1280_720.mp4'
    },
    {
      end: 82.8,
      start: 79.9,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8715498_1280_720.mp4'
    },
    {
      end: 88.6,
      start: 82.8,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5593446_1280_720.mp4'
    },
    {
      end: 90.8,
      start: 88.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6651242_1280_720.mp4'
    },
    {
      end: 93.9,
      start: 90.8,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592711_1280_720.mp4'
    },
    {
      end: 98.8,
      start: 93.9,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594464_1280_720.mp4'
    },
    {
      end: 103.6,
      start: 100.1,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594474_1280_720.mp4'
    },
    {
      end: 105.9,
      start: 103.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_11494045_1280_720.mp4'
    },
    {
      end: 110.6,
      start: 105.9,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6593628_1280_720.mp4'
    },
    {
      end: 113,
      start: 110.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6841042_1280_720.mp4'
    },
    {
      end: 116.5,
      start: 113,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5842376_1280_720.mp4'
    },
    {
      end: 122.1,
      start: 116.5,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_5802022_1280_720.mp4'
    },
    {
      end: 125,
      start: 122.1,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6593639_1280_720.mp4'
    },
    {
      end: 129.2,
      start: 125,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_7801963_1280_720.mp4'
    },
    {
      end: 132.3,
      start: 129.2,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6593639_1280_720.mp4'
    },
    {
      end: 134.5,
      start: 132.3,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6985713_1280_720.mp4'
    },
    {
      end: 137,
      start: 134.5,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592717_1280_720.mp4'
    },
    {
      end: 142.3,
      start: 138.6,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594465_1280_720.mp4'
    },
    {
      end: 144.4,
      start: 142.3,
      url: 'https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6594473_1280_720.mp4'
    }
  ],
  "words": words,
  "duration": Math.max(...words.map(w => w.end))
};
/*
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
  "duration": 10
};*/

handler(event);
