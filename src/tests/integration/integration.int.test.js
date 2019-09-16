const puppeteer = require('puppeteer');
const recorder = require('../../index');

const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
};

describe('Mockeer', () => {
  beforeAll(async () => {
    await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  });
  afterAll(async () => {
    await puppeteer.close();
  });
  describe('Record', () => {
    it('a simple test', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser);
      await page.goto('http://127.0.0.1:8080/index.html');
      await autoScroll(page);
      await page.close();
      await browser.close();
    }, 10000);
    it('replaceImage', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        replaceImage: true,
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('allowImageRecourses', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        allowImageRecourses: false,
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom name', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        fixtureName: 'this is my custom test name',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom fixtures dir', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        fixturesDir: './src/tests/integration/__fixtures__/custom-dir',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom svg template', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        svgTemplate: '<svg></svg>',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await autoScroll(page);
      await page.close();
      await browser.close();
    }, 10000);
    it('with specific page', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page1 = await browser.newPage();
      const page2 = await browser.newPage();
      page1.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        page: page2,
      });
      await page1.goto('http://127.0.0.1:8080/index.html');
      await page2.goto('http://127.0.0.1:8080/contact.html');
      await autoScroll(page2);
      await page1.close();
      await page2.close();
      await browser.close();
    }, 10000);
    it('browser with multiple pages', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page1 = await browser.newPage();
      const page2 = await browser.newPage();
      const page3 = await browser.newPage();
      await recorder(browser);
      await page1.goto('http://127.0.0.1:8080/index.html');
      await page2.goto('http://127.0.0.1:8080/contact.html');
      await page3.goto('http://127.0.0.1:8080/examples.html');
      await page1.close();
      await page2.close();
      await page3.close();
      await browser.close();
    }, 10000);
  });
  describe('Record', () => {
    beforeAll(() => {
      process.env.CI = 'true';
    });
    it('a simple test', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser);
      await page.goto('http://127.0.0.1:8080/index.html');
      await autoScroll(page);
      await page.close();
      await browser.close();
    }, 20000);
    it('replaceImage', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        replaceImage: true,
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('allowImageRecourses', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        allowImageRecourses: false,
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom name', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        fixtureName: 'this is my custom test name',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom fixtures dir', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        fixturesDir: './src/tests/integration/__fixtures__/custom-dir',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await page.close();
      await browser.close();
    }, 10000);
    it('with custom svg template', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page = await browser.newPage();
      page.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        svgTemplate: '<svg></svg>',
      });
      await page.goto('http://127.0.0.1:8080/index.html');
      await autoScroll(page);
      await page.close();
      await browser.close();
    }, 10000);
    it('with specific page', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page1 = await browser.newPage();
      const page2 = await browser.newPage();
      page1.setViewport({ width: 0, height: 0 });
      await recorder(browser, {
        page: page2,
      });
      await page1.goto('http://127.0.0.1:8080/index.html');
      await page2.goto('http://127.0.0.1:8080/contact.html');
      await autoScroll(page2);
      await page1.close();
      await page2.close();
      await browser.close();
    }, 10000);
    it('browser with multiple pages', async () => {
      const browser = await puppeteer.launch({ headless: false, devtools: false });
      const page1 = await browser.newPage();
      const page2 = await browser.newPage();
      const page3 = await browser.newPage();
      await recorder(browser);
      await page1.goto('http://127.0.0.1:8080/index.html');
      await page2.goto('http://127.0.0.1:8080/contact.html');
      await page3.goto('http://127.0.0.1:8080/examples.html');
      await page1.close();
      await page2.close();
      await page3.close();
      await browser.close();
    }, 10000);
  });
});
