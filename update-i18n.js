const fs = require('fs');
const path = require('path');

const esFile = path.join(__dirname, 'messages', 'es.json');
const enFile = path.join(__dirname, 'messages', 'en.json');
const tempEsFile = path.join(__dirname, 'temp-es.json');
const tempEnFile = path.join(__dirname, 'temp-en.json');

const esCurrent = JSON.parse(fs.readFileSync(esFile, 'utf-8'));
const enCurrent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
const esNew = JSON.parse(fs.readFileSync(tempEsFile, 'utf-8'));
const enNew = JSON.parse(fs.readFileSync(tempEnFile, 'utf-8'));

function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

mergeDeep(esCurrent, esNew);
mergeDeep(enCurrent, enNew);

fs.writeFileSync(esFile, JSON.stringify(esCurrent, null, 2) + '\n');
fs.writeFileSync(enFile, JSON.stringify(enCurrent, null, 2) + '\n');
console.log('Diccionarios actualizados exitosamente.');
