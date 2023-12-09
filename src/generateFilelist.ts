import { copyVideoToLocal, createPartOfVideo } from './createPartOfVideo';
import * as fs from 'fs';
import { delay, tempDir } from './utils';
import * as path from 'path';
import { getDuration } from './getDuration';

export async function generateFilesForList(items: Array<{ url; start; end }>) {

  let max = 100;
  let current = 0;
  let i = 0;
  // start time;
  console.log('copy video to local', new Date().toISOString());
  const toCreate: Array<{ path; start; end, index }> = [];
  const promises = items.map(async (item, index) => {
    while (current >= max) {
      await delay(1000);
    }
    current++;
    const { end, start, url } = item;
    const segmentDuration = Math.round((end - start) * 100) / 100;
    //console.log('duration', duration, url);

    const randomFileName = await copyVideoToLocal(url);
    const videoDuration = await getDuration(randomFileName);
    let startTime = Math.floor(Math.random() * (videoDuration - segmentDuration) * 100) / 100;
    if (startTime < 0) {
      startTime = 0;
    }
    const endTime = Math.round((startTime + segmentDuration) * 100) / 100;
    if (isNaN(startTime) || isNaN(endTime)) {
      console.error('NaN Error', startTime, endTime, videoDuration, JSON.stringify(item));
      toCreate.push({ path: randomFileName, start: 0, end: 0, index })
    }
    else {
      toCreate.push({ path: randomFileName, start: startTime, end: endTime, index });
    }
    current--;

  });
  await Promise.all(promises);
  max = 20;
  current = 0;
  i = 0;

  console.log('create parts', new Date().toISOString());

  const makePart = async (item) => {
    const { end, start, path } = item;

    const url = await createPartOfVideo(path, start, end);
    items[item.index].url = url;
    if (path !== url) {
      fs.unlinkSync(path);
    }
  };
  for (const item of toCreate) {
    await makePart(item);
  }

  /*
  const promises2 = items.map(async (item, index) => {
    while (current >= max) {
      await delay(1000);
    }
    current++;

    const { end, start, path } = toCreate[index];
    item.url = await createPartOfVideo(path, start, end);
    fs.unlinkSync(path);
    current--;
    i++;
    if (i % 50 === 0) {
      console.log(`Video parts: (${i}/${items.length})`, new Date().toISOString());
    }
  });
  await Promise.all(promises2);*/
  console.log(new Date().toISOString());
  return items;
}
export async function writeFilelist(items: Array<{ url; start; end }>) {
  // Create a temporary file to store the list of input files
  const fileListPath = path.join(tempDir, 'filelist.txt');
  const resultItems: string[] = [];
  let totalDuration = 0;

  const round = (num) => Math.round(num * 100) / 100;
  let start = 0; // sanity check to remove black frames
  for (const item of items) {
    resultItems.push(`file '${item.url}'`);
    const duration = round(item.end - start);
    resultItems.push(`inpoint 0.0`);
    resultItems.push(`outpoint ${duration}`);
    totalDuration = round(totalDuration + duration);
    start = item.end;
  }
  const filelistContent = resultItems.join('\n');
  // Write the file list to a text file
  fs.writeFileSync(fileListPath, filelistContent);

  return fileListPath;
}
