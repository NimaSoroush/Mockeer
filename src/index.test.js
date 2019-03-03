const recorder = require('./index');
const handleRecordMode = require('./helpers/recorder');
const handlePlayMode = require('./helpers/player');

jest.mock('./helpers/recorder', () => jest.fn());
jest.mock('./helpers/player', () => jest.fn());
jest.mock('./utils/svg-template', () => ({
  svgTemplate: '<svg />',
}));
jest.mock('fs');

describe('recorder:', () => {
  describe('record mode:', () => {
    beforeEach(() => {
      handlePlayMode.mockClear();
      handleRecordMode.mockClear();
    });
    it('calls handlePlayMode with correct parameters', async () => {
      await recorder(Object);
      expect(handleRecordMode).toHaveBeenCalledWith(expect.objectContaining({
        browser: Object,
        config: {
          allowImageRecourses: false,
          fixtureFilePath:
            expect.stringContaining(
              'src/__fixtures__/recorder record mode calls handlePlayMode with correct parameters.json',
            ),
          fixturesDir: expect.stringContaining('src/__fixtures__'),
          page: null,
          replaceImage: false,
          svgTemplate: '<svg />',
        },
      }));
    });
    it('calls handlePlayMode with correct parameters', async () => {
      process.env.CI = 'true';
      await recorder(Object);
      expect(handlePlayMode).toHaveBeenCalledWith(expect.objectContaining({
        browser: Object,
        config: {
          allowImageRecourses: false,
          fixtureFilePath:
            expect.stringContaining(
              'src/__fixtures__/recorder record mode calls handlePlayMode with correct parameters.json',
            ),
          fixturesDir: expect.stringContaining('src/__fixtures__'),
          page: null,
          replaceImage: false,
          svgTemplate: '<svg />',
        },
      }));
    });
  });
});
