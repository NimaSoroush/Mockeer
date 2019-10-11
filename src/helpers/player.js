const fs = require('fs');
const isImage = require('is-image');
const path = require('path');
const parse = require('url-parse');
const { svgContentTypeHeader, svgContentLength } = require('../utils/svg-template');
const { removeLastDirectoryPartOfUrl } = require('./url-helper');

const getBrowserPages = async browser => browser.pages();

const getScope = (url, fixtures) => {
  const elementPos = fixtures.map(x => x.url).indexOf(url);
  if (elementPos >= 0) {
    const objectFound = fixtures[elementPos];
    if (objectFound) {
      const { body } = objectFound;
      if (isImage(objectFound.fullPath) && path.extname(objectFound.url) !== '.svg') {
        objectFound.headers['content-type'] = svgContentTypeHeader;
        objectFound.headers['content-length'] = svgContentLength;
      }
      return {
        status: objectFound.status || 200,
        headers: objectFound.headers,
        body,
      };
    }
  }
  return null;
};

const handlePlayMode = async ({ browser, config }) => {
  const fixtures = JSON.parse(fs.readFileSync(config.fixtureFilePath));
  const setRequestInterceptor = async (p) => {
    await p.setRequestInterception(true);
    p.on('request', (request) => {
      if (config.disallowedResourceTypes.includes(request.resourceType())) {
        return request.continue();
      }

      let response = getScope(request.url(), fixtures);
      if (!response) {
        const parsedUrl = parse(request.url(), true);
        response = getScope(`${parsedUrl.origin}${parsedUrl.pathname}`, fixtures);
        if (!response) {
          response = getScope(removeLastDirectoryPartOfUrl(`${parsedUrl.origin}${parsedUrl.pathname}`), fixtures);
        }
      }
      return response
        ? request.respond(response)
        : request.abort();
    });
  };
  if (config.page) {
    await setRequestInterceptor(config.page);
  } else {
    const pagePromiseArray = [];
    const pages = await getBrowserPages(browser);
    pages.forEach(p => pagePromiseArray.push(setRequestInterceptor(p)));
    await Promise.all(pagePromiseArray);
  }
};

module.exports = handlePlayMode;
