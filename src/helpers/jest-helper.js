const path = require('path');
const MODES = require('./mockeer-modes');
const { getFixtureFile } = require('./file-helper');

const isFunc = property => (typeof (property) === 'function');

const isJest = () => {
  try {
    return (expect && isFunc(expect.getState));
  } catch (error) {
    // Ignore the error
  }
  return false;
};

const getJestMode = () => {
  const testStats = expect.getState() || null;
  return testStats && testStats.snapshotState._updateSnapshot === 'all' ? MODES.RECORD : MODES.PLAY;
};

const getJestTestPath = fixturesDir => (isJest() ? getFixtureFile(fixturesDir, expect.getState().currentTestName) : null);

const getJestTestFolder = () => (isJest() ? path.dirname(expect.getState().testPath) : null);

const isUpdate = () => (isJest() ? expect.getState().snapshotState._updateSnapshot === 'all' : false);

module.exports = {
  getJestMode, isJest, getJestTestPath, isUpdate, getJestTestFolder,
};
