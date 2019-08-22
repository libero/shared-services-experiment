#!/usr/bin/env node
const { writeFileSync} = require('fs');
const { Etcd3 } = require('etcd3');
const { set, debounce } = require('lodash');

const CONFIG_FILE = process.env.CONFIG_FILE || '/etc/configuration/libero.json';
const CONFIG_URL = process.env.CONFIG_URL || 'http://localhost:2379';

const createConfigurationFile = (configData) => {
    console.log(new Date().toISOString(), JSON.stringify(configData, null, 4));
    writeFileSync(CONFIG_FILE,
    JSON.stringify(configData, null, 4),
    'utf-8');
}

const updateRowInConfig = (config, key, value) => {
  let bits = key.split('/');
  if (bits && bits[0] === '') {
    bits = bits.slice(1);
  }
  set(config, bits, value);
  return config;
}

const toStructuredJson = (data) => {
  let config = {};

  Object.keys(data).forEach(key => {
    config = updateRowInConfig(config, key, data[key]);
  });
  return config;
}

const pullAllConfig = async (client) => {
  let config = {}
  try {
    config = await client.getAll().strings();
  } catch (e) {
    console.error(e);
    throw e;
  }
  return toStructuredJson(config);
}

const watchForChanges = async (client, configData) => {
  const debounceWrite = debounce( createConfigurationFile, wait=1000);
  await client
    .watch()
    .prefix('/')
    .create()
    .then(watcher =>{
      watcher.on('put', res => {
        updateRowInConfig(configData, res.key.toString(), res.value.toString());
        debounceWrite(configData);
      });
    })
}

const run = async (configUrl) => {
  const client = new Etcd3({
    hosts: configUrl
  });

  const configData = await pullAllConfig(client);
  createConfigurationFile(configData);
  watchForChanges(client, configData);
}

run(CONFIG_URL);
