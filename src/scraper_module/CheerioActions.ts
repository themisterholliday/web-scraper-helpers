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

function getProxiesFromTable(
  html: string,
): { ipAddress: string; port: string }[] {
  const $ = cheerio.load(html);
  const proxies: { ipAddress: string; port: string }[] = $('table tr')
    .map((index: number, tr: CheerioElement) => {
      if (!index) {
        // Skip the first row.
        return;
      }

      const cells = $('td', tr);
      const ipAddress = cells
        .eq(0)
        .text()
        .toString();
      const port = cells
        .eq(1)
        .text()
        .toString();

      return { ipAddress, port };
    })
    .get();
  return proxies;
}

export {
  extractTextFromSelector,
  extractValueFromSelector,
  getAllLinks,
  getTextFromElementContainingString,
  getTextFromElementAfterElementContainingString,
  getProxiesFromTable,
};
