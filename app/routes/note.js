const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const note_path = './data/note/';

/* Rename file*/
router.post('/rename', function(req,res,next) {
  const from_path = note_path+req.body.path;
  const to_path = note_path + req.body.data;

  if (to_path == note_path) { //変換先ファイル名がないとき、削除
    try {
      fs.statSync(from_path); //ファイルが存在
      fs.unlinkSync(from_path);
    } catch (err) {
      if (err.code === 'ENOENT') res.status(200).send('ENOENT');
    }

    res.status(200).send('deleted');
    return;
  }
  
  fs.renameSync(from_path, to_path);
  res.status(200).send('rename');
});

/* Make Directory */
router.post('/mkdir', function(req,res,next) {
  const filepath = note_path + req.body.path;

  try {
    fs.statSync(filepath);// 親フォルダの存在確認
  } catch (err) {
    fs.mkdirSync(filepath); //同期作成->フォルダ作成後に書き込み
  }

  res.status(200).send('mkdir');
});

/* Save file */
router.post('/save', function(req,res,next) {
  const filepath = note_path + req.body.path;
  const data = req.body.data;
  const file_dir = path.dirname(filepath);

  try {
    fs.statSync(file_dir);// 親フォルダの存在確認
  } catch (err) {
    fs.mkdirSync(file_dir); //同期作成->フォルダ作成後に書き込み
  }

  if (data.length <= 0) { //書き込む中身がないとき、削除
    try {
      fs.statSync(filepath); //ファイルが存在
      fs.unlinkSync(filepath);
    } catch (err) {
      if (err.code === 'ENOENT') res.status(200).send('ENOENT');
    }

    res.status(200).send('deleted');
    return;
  }

  fs.writeFileSync(filepath,iconv.encode(data,'shift-jis'));

  res.status(200).send('saved');
});

/* Load file contents */
router.post('/load', function(req,res,next) {
  const filepath = note_path + req.body.path;
  const content_str = iconv.decode(fs.readFileSync(filepath),'shift-jis');
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