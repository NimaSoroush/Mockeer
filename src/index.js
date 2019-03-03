const fs = require('fs');
const handlePlayMode = require('./helpers/player');
const handleRecordMode = require('./helpers/recorder');
const sanitiseConfiguration = require('./sanitiser');
const { isUpdate } = require('./helpers/jest-helper');

const MODES = Object.freeze({
  RECORD: 'record',
  PLAY: 'play',
});

const recorder = async (browser, configuration) => {
  if (!browser) throw new Error('`browser` is a required parameter');
  const config = sanitiseConfiguration(configuration);
  if (!fs.existsSync(config.fixturesDir)) fs.mkdirSync(config.fixturesDir);
  const recorderMode = process.env.CI === 'true' ? MODES.PLAY : MODES.RECORD;
  if (isUpdate() || recorderMode === MODES.RECORD) {
    if (fs.existsSync(config.fixtureFilePath)) fs.unlinkSync(config.fixtureFilePath);
    return handleRecordMode({ browser, config });
  }

  return handlePlayMode({ browser, config });
};

module.exports = recorder;
