const sanitiseConfiguration = require('./sanitiser');

describe('recorder:', () => {
  describe('record mode:', () => {
    it('sanitise if no config provided', () => {
      const configuration = sanitiseConfiguration();
      expect(configuration).toEqual(expect.objectContaining({
        allowImageRecourses: false,
        fixtureFilePath: expect.stringContaining('src/__fixtures__/recorder record mode sanitise if no config provided.json'),
        fixturesDir: expect.stringContaining('/src/__fixtures__'),
        page: null,
        replaceImage: false,
        svgTemplate: expect.anything(),
      }));
    });
    it('gets the fixture path from fixturesDir', () => {
      const configuration = sanitiseConfiguration({ fixturesDir: 'path/to/fixtures' });
      expect(configuration).toEqual(expect.objectContaining({
        allowImageRecourses: false,
        fixtureFilePath: expect.stringContaining('path/to/fixtures/recorder record mode gets the fixture path from fixturesDir.json'),
        fixturesDir: expect.stringContaining('path/to/fixtures'),
        page: null,
        replaceImage: false,
        svgTemplate: expect.anything(),
      }));
    });
    it('gets the fixture name from fixtureName', () => {
      const configuration = sanitiseConfiguration({ fixtureName: 'fixture-name' });
      expect(configuration).toEqual(expect.objectContaining({
        allowImageRecourses: false,
        fixtureFilePath: expect.stringContaining('src/__fixtures__/fixture-name.json'),
        fixturesDir: expect.stringContaining('src/__fixtures__'),
        page: null,
        replaceImage: false,
        svgTemplate: expect.anything(),
      }));
    });
  });
});
