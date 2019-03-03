const fs = require('fs');
const recorder = require('./recorder');
const sanitiseConfiguration = require('../sanitiser');

jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
}));

const configuration = sanitiseConfiguration({ fixtureName: 'fixture-name' });

describe('Recorder:', () => {
  it('calls handleRecordMode with correct parameters', async () => {
    const page = {
      setRequestInterception: jest.fn(),
      on: jest.fn(),
    };
    const browser = {
      on: jest.fn(),
    };
    const modifiedConfig = ({ ...configuration, ...{ page } });
    await recorder({ browser, config: modifiedConfig });
    expect(page.on).toHaveBeenCalledWith('response', expect.any(Function));
  });
  describe('on `response` single page', () => {
    beforeEach(() => {
      fs.appendFileSync.mockReset();
    });
    it('writes correct snapshot', async () => {
      const response = {
        ok: () => true,
        url: () => 'http://www.example.com/x/?foo=bar',
        headers: () => ({ 'content-type': 'application/json' }),
        status: () => 200,
        request: () => ({
          method: () => 'GET',
        }),
        text: jest.fn(() => '{}'),
      };
      const fnList = [];
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const browser = {
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page } });
      await recorder({ browser, config: modifiedConfig });
      // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
      for (const fn of fnList) { await fn(response); }
      expect(page.on).toHaveBeenCalledWith('response', expect.any(Function));
      expect(response.text).toHaveBeenCalled();
      expect(fs.appendFileSync.mock.calls[0][1]).toMatchSnapshot();
    });
    fit('will not write snapshot when resource is image and replaceImage=false', async () => {
      const response = {
        ok: () => true,
        url: () => 'http://www.example.com/x.jpg?foo=bar',
        headers: () => ({ 'content-type': 'application/json' }),
        status: () => 200,
        request: () => ({
          method: () => 'GET',
        }),
        text: jest.fn(() => '{}'),
      };
      const fnList = [];
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const browser = {
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page, replaceImage: false } });
      console.log(modifiedConfig);
      await recorder({ browser, config: modifiedConfig });
      // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
      for (const fn of fnList) { await fn(response); }
      expect(page.on).toHaveBeenCalledWith('response', expect.any(Function));
      expect(response.text).not.toHaveBeenCalled();
      expect(fs.appendFileSync.mock.calls[0][1]).toMatchSnapshot();
    });
    it('writes correct snapshot when resource is image and replaceImage=true', async () => {
      const response = {
        ok: () => true,
        url: () => 'http://www.example.com/x.jpg?foo=bar',
        headers: () => ({ 'content-type': 'application/json' }),
        status: () => 200,
        request: () => ({
          method: () => 'GET',
        }),
        text: jest.fn(() => '{}'),
      };
      const fnList = [];
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const browser = {
        on: jest.fn((type, fn) => fnList.push(fn)),
      };
      const modifiedConfig = ({ ...configuration, ...{ page, replaceImage: true } });
      await recorder({ browser, config: modifiedConfig });
      // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
      for (const fn of fnList) { await fn(response); }
      expect(page.on).toHaveBeenCalledWith('response', expect.any(Function));
      expect(response.text).not.toHaveBeenCalled();
      expect(fs.appendFileSync.mock.calls[0][1]).toMatchSnapshot();
    });
  });
  describe('on `response` multiple pages', () => {
    it('will get called multiple times', async () => {
      const response = {
        ok: () => true,
        url: () => 'http://www.example.com/x?foo=bar',
        headers: () => ({ 'content-type': 'application/json' }),
        status: () => 200,
        request: () => ({
          method: () => 'GET',
        }),
        text: jest.fn(() => '{}'),
      };
      const page = {
        setRequestInterception: jest.fn(),
        on: jest.fn((type, fn) => fn(response)),
      };
      const browser = {
        on: jest.fn((type, fn) => fn()),
        pages: () => [page, page],
      };
      const modifiedConfig = ({ ...configuration, ...{ page: undefined } });
      await recorder({ browser, config: modifiedConfig });
      expect(page.on).toHaveBeenCalledTimes(2);
      expect(response.text).toHaveBeenCalledTimes(2);
      expect(fs.appendFileSync).toHaveBeenCalledTimes(2);
    });
  });
});
