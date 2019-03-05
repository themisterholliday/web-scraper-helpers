export function extractTextFromSelector(
  html: string,
  selector: string,
): string {
  console.log(`Extracting Text from selector ${selector}`);
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  return $(selector).text();
}

export function extractValueFromSelector(
  html: string,
  selector: string,
): string {
  console.log(`Extracting Value from selector ${selector}`);
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  return $(selector).val();
}
