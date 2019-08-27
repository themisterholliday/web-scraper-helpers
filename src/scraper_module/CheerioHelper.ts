import cheerio from 'cheerio';

function extractTextFromSelector(html: string, selector: string): string {
  console.log(`Extracting Text from selector ${selector}`);
  const $ = cheerio.load(html);
  return $(selector).text();
}

function extractValueFromSelector(html: string, selector: string): string {
  console.log(`Extracting Value from selector ${selector}`);
  const $ = cheerio.load(html);
  return $(selector).val();
}

function getAllLinks(html: string): string[] {
  const $ = cheerio.load(html);
  const links = $('a');
  const finalLinks: string[] = $(links)
    .map((_: number, link: CheerioElement) => $(link).attr('href'))
    .get();
  return finalLinks;
}

function getTextFromElementContainingString(
  html: string,
  string: string,
): string {
  const $ = cheerio.load(html);
  return $(`span:contains(${string})`).text();
}

function getTextFromElementAfterElementContainingString(
  html: string,
  string: string,
): string {
  const $ = cheerio.load(html);
  return $(`span:contains(${string})`)
    .next()
    .text();
}

export {
  extractTextFromSelector,
  extractValueFromSelector,
  getAllLinks,
  getTextFromElementContainingString,
  getTextFromElementAfterElementContainingString,
};
