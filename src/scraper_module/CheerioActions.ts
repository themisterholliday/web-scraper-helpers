import cheerio from 'cheerio';

export function extractTextFromSelector(
  html: string,
  selector: string,
): string {
  console.log(`Extracting Text from selector ${selector}`);
  const $ = cheerio.load(html);
  return $(selector).text();
}

export function extractValueFromSelector(
  html: string,
  selector: string,
): string {
  console.log(`Extracting Value from selector ${selector}`);
  const $ = cheerio.load(html);
  return $(selector).val();
}

export function getAllLinks(html: string): string[] {
  const $ = cheerio.load(html);
  const links = $('a');
  const finalLinks: string[] = $(links)
    .map((_: number, link: CheerioElement) => $(link).attr('data-profileid'))
    .get();
  return finalLinks;
}

export function getTextFromElementContainingString(
  html: string,
  string: string,
): string {
  const $ = cheerio.load(html);
  return $(`span:contains(${string})`).text();
}

export function getTextFromElementAfterElementContainingString(
  html: string,
  string: string,
): string {
  const $ = cheerio.load(html);
  return $(`span:contains(${string})`)
    .next()
    .text();
}
