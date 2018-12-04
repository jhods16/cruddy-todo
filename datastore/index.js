const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = 
  // var path.join(__dirname, `${id}.txt`);
  // get id
  // upon the getting of the id
  //  write a file with the id as the filename
  //  and text as the data
  //create an object with the id as the id
  //and the text as the data
  
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('no id created');
    } else {
      var idFile = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(idFile, text, (err) => {
        if (err) {
          throw ('error writing idFile');
        } else {
          callback( null, { id, text });
        }
      });
    }
  });
  // items[id] = text;
  
  // (err, id)=> {
  //   fs.writeFile(.. id.txt, text, callback(id, text))
  // }
  // fs.readFile(path, data, (err, fileData) => {
  //   callback(null, {id: path, text: data})
  // })
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = [];
  _.each(items, (text, id) => {
    data.push({ id, text });
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
