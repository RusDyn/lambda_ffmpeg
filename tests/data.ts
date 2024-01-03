/*
const words: Array<{ start, end, word }> = [
  { word: 'Feel', start: 0, end: 0.4 },
  { word: 'that', start: 0.4, end: 0.5 },
  { word: 'tightness', start: 0.5, end: 0.9 },
  { word: 'in', start: 0.9, end: 1.2 },
  { word: 'your', start: 1.2, end: 1.2 },
  { word: 'chest.', start: 1.2, end: 1.4 }
]*/

const words = [
    {
        "word": "Feel",
        "start": 0,
        "end": 0.4
    },
    {
        "word": "that",
        "start": 0.4,
        "end": 0.6
    },
    {
        "word": "tightness",
        "start": 0.6,
        "end": 0.9
    },
    {
        "word": "in",
        "start": 0.9,
        "end": 1.2
    },
    {
        "word": "your",
        "start": 1.2,
        "end": 1.3
    },
    {
        "word": "chest?",
        "start": 1.3,
        "end": 1.4
    },
    {
        "word": "It's",
        "start": 1.4,
        "end": 1.9
    },
    {
        "word": "more",
        "start": 3,
        "end": 3.2
    },
    {
        "word": "than",
        "start": 3.2,
        "end": 3.3
    },
    {
        "word": "just",
        "start": 3.3,
        "end": 3.4
    },
    {
        "word": "a",
        "start": 3.4,
        "end": 3.6
    },
    {
        "word": "button",
        "start": 3.6,
        "end": 4
    },
    {
        "word": "on",
        "start": 4,
        "end": 4.1
    },
    {
        "word": "your",
        "start": 4.1,
        "end": 4.2
    },
    {
        "word": "shirt",
        "start": 4.2,
        "end": 4.6
    },
    {
        "word": "straining",
        "start": 4.6,
        "end": 5.2
    },
    {
        "word": "to",
        "start": 5.2,
        "end": 5.3
    },
    {
        "word": "hold",
        "start": 5.3,
        "end": 5.4
    },
    {
        "word": "on.",
        "start": 5.4,
        "end": 5.8
    },
    {
        "word": "It's",
        "start": 5.8,
        "end": 6.9
    },
    {
        "word": "the",
        "start": 6.9,
        "end": 7
    },
    {
        "word": "weight",
        "start": 7,
        "end": 7.4
    },
    {
        "word": "of",
        "start": 7.4,
        "end": 7.5
    },
    {
        "word": "every",
        "start": 7.5,
        "end": 7.8
    },
    {
        "word": "failed",
        "start": 7.8,
        "end": 8.2
    },
    {
        "word": "diet,",
        "start": 8.2,
        "end": 8.7
    },
    {
        "word": "every",
        "start": 8.7,
        "end": 9.3
    },
    {
        "word": "magic",
        "start": 9.3,
        "end": 9.8
    },
    {
        "word": "pill,",
        "start": 9.8,
        "end": 10.1
    }
]

/*
  "audio": {
  "bucket": "yfactory-public",
    "name": "https://s3.eu-north-1.amazonaws.com/yfactory-public/audio_45.mp3"
},*/

const videos = [
    {
        "end": 1.4,
        "start": 0,
        "url": "https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_8410575_1280_720.mp4"
    },
    {
        "end": 5.8,
        "start": 1.4,
        "url": "https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_11494045_1280_720.mp4"
    },
    {
        "end": 10.1,
        "start": 5.8,
        "url": "https://s3.eu-north-1.amazonaws.com/yfactory-public/pexels_video_6592934_1280_720.mp4"
    }
];

const audioUrl = 'https://s3.eu-north-1.amazonaws.com/yfactory-public/audio_40.mp3';
const audios2 = [{
    url: audioUrl,
    start: 0,
    end: 1
},
{
    url: audioUrl,
    start: 2,
    end: 4
},
{
    url: audioUrl,
    start: 3,
    end: 4
},
{
    url: audioUrl,
    start: 6,
    end: 7
}];
const audios = [
    {
        "url": "https://s3.eu-north-1.amazonaws.com/yfactory-public/audio_51.mp3"
    },
    {
        "url": "https://s3.eu-north-1.amazonaws.com/yfactory-public/audio_51.mp3"
    }
];

const styles = [{ font: 'Arial', size: 32 }];

export default {
    words,
    audios,
    videos,
    styles,
};

