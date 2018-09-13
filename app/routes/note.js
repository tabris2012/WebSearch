var express = require('express');
var router = express.Router();
var fs = require('fs');
const iconv = require('iconv-lite');

const note_path = './data/note/';

/* Save file */
router.post('/save', function(req,res,next) {
  const path = req.body.path;
  const data = req.body.data;

  // TBD: 親フォルダの存在確認


  if (data.length <= 0) {
    try {
      fs.statSync(note_path+path); //ファイルが存在
      fs.unlinkSync(note_path+path);
    } catch (err) {
      if (err.code === 'ENOENT') res.status(200).send('ENOENT');
    }
  }
  fs.writeFileSync(note_path+path,iconv.encode(data,'shift-jis'));

  res.status(200).send('saved');
});

/* Load file contents */
router.post('/load', function(req,res,next) {
  const path = req.body.path;
  const content_str = iconv.decode(fs.readFileSync(note_path+path),'shift-jis');
  res.status(200).send(content_str);
});

/* Search file contents. */
router.get('/search', function(req, res, next) {
  const key = req.query.data;

  const array = [];
  var content_str = "";

  function recursiveSearchFile(path_list, parent_str) {
    const dir_list = path_list.filter(function(file) {
      return fs.statSync(note_path+parent_str+file).isDirectory();
    });
    const file_list = path_list.filter(function(file) {
      return fs.statSync(note_path+parent_str+file).isFile();
    });

    file_list.forEach((file) => {
      content_str = iconv.decode(fs.readFileSync(note_path+parent_str+file),'shift-jis');

      if (~content_str.indexOf(key)) {
        array.push(parent_str+file);
      }
    })

    dir_list.forEach((dir) => {
      recursiveSearchFile(fs.readdirSync(note_path+parent_str+dir), parent_str+dir+'/');
    });
  }

  recursiveSearchFile(fs.readdirSync(note_path),'./');

  res.status(200).json(array);
});

module.exports = router;