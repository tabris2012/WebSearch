var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

const data_path = './data/crawling/';

var SearchHtml = {
  searchKeyInDir: function(key, rpath) {
    const dir = data_path+rpath;
    const array = [];

    if (!fs.statSync(dir).isDirectory()) {
      return array; //ディレクトリの存在確認
    }
    
    const file_list = fs.readdirSync(dir).filter(function(file) {
      return fs.statSync(dir+file).isFile(); //フォルダ内ファイルリスト
    });

    var document = null;
    var content_str = "";

    file_list.forEach((file) => {
      document = cheerio.load(iconv.decode(fs.readFileSync(dir+file),'shift-jis'));
      content_str = document.text()
      
      if (~content_str.indexOf(key)) {
        array.push(
          {'filename': file,
          'title': document('title').text(),
          'path': (rpath+file)});
      }
    });

    return array;
  }
}

module.exports = SearchHtml;