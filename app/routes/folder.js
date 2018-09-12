var express = require('express');
var router = express.Router();
var fs = require('fs');

const data_path = './data/crawling/';
const note_path = './data/note/';

function createDirStr(root_dir, only_dir) {
  if (only_dir == null) {
    only_dir = false; //デフォルト引数
  }

  const array = [];

  const data = {}; //最初にルートディレクトリを追加
  data['id'] = './';
  data['parent'] = '#';
  data['text'] = 'Root';
  data['state'] = {'opened': true};
  array.push(data);

  function recursiveAddDir(file_list, parent_str) {
    const dir_list = file_list.filter(function(file) {
      return fs.statSync(root_dir+parent_str+file).isDirectory();
    })

    if (only_dir) { //ディレクトリのみ参照
      file_list = dir_list;
    }

    file_list.forEach((file) => {
      const data = {};

      if (fs.statSync(root_dir+parent_str+file).isFile()) {
        data['icon'] = 'jstree-file';
        data['id'] = parent_str+file;
      }
      else { //ディレクトリ
        data['id'] = parent_str+file+'/';
      }

      data['parent'] = parent_str;
      data['text'] = file;
      array.push(data);
    });

    dir_list.forEach((dir) => {
      recursiveAddDir(fs.readdirSync(root_dir+parent_str+dir), parent_str+dir+'/');
    });
  }

  recursiveAddDir(fs.readdirSync(root_dir), './');

  return array;
}

/* GET filepath */
router.get('/', function(req, res, next) {
  const method = req.query.method;
  var res_array = null;

  switch (method) {
    case 'directory':
      res_array = createDirStr(data_path, true);
      break;
    case 'note-dir':
      res_array = createDirStr(note_path);
  }

  console.log("folder: ");
  console.log(res_array);
  res.status(200).json(res_array);
});

function createResponseStr(key, rpath) {
  const path_list = rpath.split(',');
  const array = [];

  path_list.forEach((path) => {
    const res_array = [];

    res_array.forEach((res) => {
      const data = {};

    });

    array.push(data);
  });

  return array;
}

/* GET filepath with query. */
router.get('/search', function(req, res, next) {
  const key = req.query.key;
  const path = req.query.path;
  var res_array = createResponseStr(key,path);

  console.log(key);
  res.status(200).json(res_array);
});

module.exports = router;
