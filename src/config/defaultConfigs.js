const { svgTemplate } = require('../utils/svg-template');

const globalConfig = {
  fixturesDir: '__mockeer_fixture__',
  fixtureName: 'chrome-http-mocks',
  svgTemplate,
  replaceImage: false,
  allowImageRecourses: false,
};

module.exports = { globalConfig };
