const filenamify = require('filenamify');
const path = require('path');

const getFixtureFile = (filePath, fileName) => path.join(filePath, `${filenamify(fileName, { replacement: '' })}.json`);
const getFixtureFolder = (fixturesPath, fixturesFolder) => path.join(fixturesPath, fixturesFolder);

module.exports = { getFixtureFile, getFixtureFolder };
