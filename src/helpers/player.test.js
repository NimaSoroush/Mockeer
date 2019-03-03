const fs = require('fs');
const player = require('./player');
const sanitiseConfiguration = require('../sanitiser');

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => `[{
    "url": "http://www.example.com/x/?foo=bar",
    "fullPath": "http://www.example.com/x",
    "minimalPath": "http://www.example.com/x",
    "query": {
      "foo": "bar"
    },
    "headers": {
      "content-type": "application/json"
    },
    "status": 200,
    "method": "GET",
    "body": "{}"
  }]`),
}));

const configuration = sanitiseConfiguration({ fixtureName: 'fixture-name' });

describe('Player:', () => {
  it('calls handlePlayMode with correct parameters', async () => {
    const page = {
      setRequestInterception: jest.fn(),
      on: jest.fn(),
    };
    const modifiedConfig = ({ ...configuration, ...{ page, replaceImage: false } });
    await player({ browser: Object, config: modifiedConfig });
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
    expect(page.setRequestInterception).toHaveBeenCalledWith(true);
    expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
  });
  describe('on `request` single page', () => {
    it('Abort when resource is image and allowImageRecourses=false', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com',
        abort: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page, replaceImage: false } });
      await player({ browser: Object, config: modifiedConfig });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.abort).toHaveBeenCalled();
    });
    it('Continue when resource is image and allowImageRecourses=true', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com',
        continue: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page, allowImageRecourses: true } });
      await player({ browser: Object, config: modifiedConfig });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.continue).toHaveBeenCalled();
    });
    it('Respond when resource is image and allowImageRecourses=true', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com/x/?foo=bar',
        respond: jest.fn(),
        continue: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page, allowImageRecourses: true } });
      await player({ browser: Object, config: modifiedConfig });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.respond).not.toHaveBeenCalled();
      expect(request.continue).toHaveBeenCalled();
    });
  });
  describe('on `request` multiple pages', () => {
    it('Abort when resource is image and allowImageRecourses=false', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com',
        abort: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const browser = {
        pages: () => [page, page],
      };
      await player({ browser, config: configuration });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledTimes(2);
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledTimes(2);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.abort).toHaveBeenCalledTimes(2);
    });
    it('Continue when resource is image and allowImageRecourses=true', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com',
        continue: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const browser = {
        pages: () => [page, page],
      };
      const modifiedConfig = ({ ...configuration, ...{ allowImageRecourses: true } });
      await player({ browser, config: modifiedConfig });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledTimes(2);
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledTimes(2);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.continue).toHaveBeenCalledTimes(2);
    });
    it('Respond when resource is image and allowImageRecourses=true', async () => {
      const request = {
        resourceType: () => 'image',
        url: () => 'http://www.example.com/x/?foo=bar',
        respond: jest.fn(),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(request)),
      };
      const browser = {
        pages: () => [page, page],
      };
      await player({ browser, config: configuration });
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('__fixtures__'));
      expect(page.setRequestInterception).toHaveBeenCalledTimes(2);
      expect(page.setRequestInterception).toHaveBeenCalledWith(true);
      expect(page.on).toHaveBeenCalledTimes(2);
      expect(page.on).toHaveBeenCalledWith('request', expect.any(Function));
      expect(request.respond).toHaveBeenCalledTimes(2);
    });
  });
});
