import * as fs from 'fs';

import { outputDir } from './utils';
import { ffmpeg_run } from './ffmpeg';
import * as path from 'path';

export interface Audio {
    url: string;
    start?: number;
    end?: number;
}
function createFFmpegArgs(audios: Audio[], outputFile: string, maxDuration: number): string[] {
    let args: string[] = [
        '-loglevel', 'error',
        '-hide_banner',
    ];

    // Add inputs and their trimming (without start or end time)
    audios.forEach(audio => {
        args = args.concat([
            '-i', audio.url,
        ]);
    });

    // Construct filter_complex for trimming and delaying each audio
    let filterComplexInputs = audios.map((audio, index) => {
        const delay = (audio.start || 0) * 1000; // Delay in milliseconds
        const start = 0;
        const end = (audio.end || maxDuration) - (audio.start || 0);
        return `[${index}:a]atrim=start=${start}:end=${end},adelay=${delay}|${delay}[aud${index}];`;
    }).join('');

    // Combine the filtered audio streams
    const filterComplexMix = audios.map((_, index) => `[aud${index}]`).join('') + `amix=inputs=${audios.length}:duration=longest[out]`;

    args = args.concat([
        '-filter_complex', filterComplexInputs + filterComplexMix,
        '-map', '[out]',
        '-t', maxDuration.toString(),
        '-acodec', 'libmp3lame',
        outputFile,
        '-y'
    ]);

    return args;
}

export async function mergeAudio(audios: Audio[], outputFileDuration: number, fileFullPath?: string): Promise<string> {
    if (!fileFullPath) {
        const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        fileFullPath = path.join(outputDir, `out_${randomName}.mp3`);
    }

    const args = createFFmpegArgs(audios, fileFullPath, outputFileDuration);
    await ffmpeg_run(args);
    return fileFullPath;
}

