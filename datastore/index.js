const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  
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
};

exports.readAll = (callback) => {
  var data = [];
  
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('no files in directory');
    } else {
      _.each(files, (fileName) => {
        data.push({ id: fileName.split('.')[0], text: fileName.split('.')[0]});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var idFile = path.join(exports.dataDir, `${id}.txt`);
  
  fs.readFile(idFile, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data.toString() });
    }
  });
  
};

exports.update = (id, text, callback) => {
  var idFile = path.join(exports.dataDir, `${id}.txt`);
  
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(idFile, text, (err) =>{
        if (err) {
          callback(new Error('Cannot write file'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var idFile = path.join(exports.dataDir, `${id}.txt`);
  
  fs.unlink(idFile, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
