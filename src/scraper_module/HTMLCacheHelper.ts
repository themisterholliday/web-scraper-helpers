import { promiseWriteFile, promiseReadFile } from '../util/ConvenientFileUtils';

export async function cacheHTMLForURL(
  html: string,
  url: string,
  location: string,
): Promise<void> {
  const finalURL = `${url.split('/').join('_')}.html`;
  await promiseWriteFile(`${location}/${finalURL}`, html);
}

export async function getHTMLCacheForURL(
  url: string,
  location: string,
): Promise<string> {
  const finalURL = `${url.split('/').join('_')}.html`;
  const html = await promiseReadFile(`${location}/${finalURL}`).catch(
    _ => undefined,
  );
  return html;
}
