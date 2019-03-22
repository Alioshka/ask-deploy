'use strict';

const path = require('path');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const cli = require('./cli.js').args;

const ROOT_DIR = process.cwd();
const CONFIG_DIR = '/config';
const ASK_DIR = '/.ask';
const DIST = '/dist';
const SRC = {
  LAMBDA: '/lambda',
  MODEL: '/models/en-US.json',
  SKILL: '/skill.json',
  ASK: '/.ask/config'
};

function run(ASK_CMD) {
  if (!cli.config) {
    throw new Error('please, specify the config: npm run {npmSrciptName} -- --config qa');
  } else {
    // read config
    const config = require(path.join(ROOT_DIR, CONFIG_DIR, `${cli.config}.json`));

    // clean 'dist' folder if exist
    fs.emptyDirSync(path.join(ROOT_DIR, DIST));

    // copy lambda code for deploy to 'dist' folder
    fs.copySync(path.join(ROOT_DIR, SRC.LAMBDA), path.join(ROOT_DIR, DIST, SRC.LAMBDA));

    // copy model with correct name for deploy to 'dist' folder
    let model = require(path.join(ROOT_DIR, SRC.MODEL));
    model.interactionModel.languageModel.invocationName = config.skillName;
    fs.outputJsonSync(path.join(ROOT_DIR, DIST, SRC.MODEL), model);

    // copy skill with correct name for deploy to 'dist' folder
    let skill = require(path.join(ROOT_DIR, SRC.SKILL));
    skill.manifest.publishingInformation.locales['en-US'].name = config.skillName;
    fs.outputJsonSync(path.join(ROOT_DIR, DIST, SRC.SKILL), skill);

    // copy correct ask config for deploy to 'dist' folder
    fs.copySync(path.join(ROOT_DIR, ASK_DIR, config.askConfig), path.join(ROOT_DIR, DIST, SRC.ASK));

    // delpoy skill from the 'dist' folder
    askDeploy(ASK_CMD);

  }
}

function askDeploy(ASK_CMD) {
  try {
    execSync(ASK_CMD, {
      stdio: 'inherit',
      cwd: path.join(ROOT_DIR, DIST)
    });
  } catch (e) {
    throw new Error(`${ASK_CMD} is failed, error: ${e}`);
  }
}

module.exports = {run};
