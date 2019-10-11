const { svgTemplate } = require('../utils/svg-template');

const globalConfig = {
  fixturesDir: '__mockeer_fixture__',
  fixtureName: 'chrome-http-mocks',
  svgTemplate,
  replaceImage: false,
  allowImageRecourses: false,
  disallowedResourceTypes: [],
  replaceIfExists: true,
};

module.exports = { globalConfig };
