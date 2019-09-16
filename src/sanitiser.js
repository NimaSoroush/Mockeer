const check = require('check-types');
const type = require('type-detect');
const { globalConfig } = require('./config/defaultConfigs');
const { getJestTestPath, getJestTestFolder, isJest } = require('./helpers/jest-helper');
const { getFixtureFile, getFixtureFolder } = require('./helpers/file-helper');

const logError = (name, wrongType, correctType) => {
  throw new Error(`Invalid argument ${name} with type ${wrongType} been passed. Argument should be ${correctType}`);
};

const checkProperty = (obj, property, checkType) => {
  if (!obj) {
    return false;
  }
  const hasProperty = Object.prototype.hasOwnProperty.call(obj, property);
  if (!check[checkType](obj[property]) && hasProperty) {
    logError(property, type(obj[property]), checkType);
    return false;
  }
  return hasProperty;
};

const sanitiseConfiguration = (conf) => {
  const configuration = {};

  if (checkProperty(conf, 'fixturesDir', 'string')) {
    configuration.fixturesDir = conf.fixturesDir;
  } else if (isJest()) {
    const fixtureFolder = getJestTestFolder();
    configuration.fixturesDir = getFixtureFolder(fixtureFolder, '__fixtures__') || globalConfig.fixturesDir;
  } else {
    configuration.fixturesDir = globalConfig.fixturesDir;
  }

  if (checkProperty(conf, 'fixtureName', 'string')) {
    configuration.fixtureFilePath = getFixtureFile(configuration.fixturesDir, conf.fixtureName);
  } else if (isJest()) {
    configuration.fixtureFilePath = getJestTestPath(configuration.fixturesDir);
  } else {
    configuration.fixtureFilePath = getFixtureFile(configuration.fixturesDir, globalConfig.fixtureName);
  }

  configuration.replaceIfExists = checkProperty(conf, 'replaceIfExists', 'boolean')
    ? conf.replaceIfExists
    : globalConfig.replaceIfExists;

  configuration.svgTemplate = checkProperty(conf, 'svgTemplate', 'string')
    ? conf.svgTemplate
    : globalConfig.svgTemplate;

  configuration.replaceImage = checkProperty(conf, 'replaceImage', 'boolean')
    ? conf.replaceImage
    : globalConfig.replaceImage;

  configuration.allowImageRecourses = checkProperty(conf, 'allowImageRecourses', 'boolean')
    ? conf.allowImageRecourses
    : globalConfig.allowImageRecourses;

  configuration.disallowedResourceTypes = checkProperty(conf, 'disallowedResourceTypes', 'array')
    ? conf.disallowedResourceTypes
    : globalConfig.disallowedResourceTypes;

  configuration.page = checkProperty(conf, 'page', 'object')
    ? conf.page
    : null;

  return configuration;
};

module.exports = sanitiseConfiguration;
