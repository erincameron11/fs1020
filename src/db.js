'use strict';

let util = require('util');
let fs = require('fs');
let path = require('path');


// Create versions of `fs` methods we'll be using to return promises
let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

// Declare where the DB path is relative from where our 'package.json' is
let dbPath = path.resolve('src/db.json');


/**
 *
*/
async function read() {
  let json = await readFile(dbPath);
  return JSON.parse(json);
}


/**
 *
*/
async function write(dbItems) {
  let json = JSON.stringify(dbItems, null, 2); // the parameters for `null` and `2` are so it's formatted with 2 spaces of indentation
  await writeFile(dbPath, json);
}


/**
 *
 */
async function addItem(item) {
  const dbItems = await read();
  dbItems.push(item);
  await write(dbItems);
}

module.exports = {
  read: read,
  addItem: addItem,
};

