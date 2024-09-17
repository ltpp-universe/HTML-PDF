const os = require('os');
const fs = require('fs');
const path = require('path');
const Console = require('node-colour-console');

module.exports.cache_path = '/.cache/puppeteer/cache';
module.exports.chrome_path = '/.cache/puppeteer/.chrome';
module.exports.cpu_thread_nums = os.cpus().length;
module.exports.pdf_dir = `${process.cwd()}/PDF/`;
module.exports.all_dir = [];
module.exports.all_dir_len = 0;
module.exports.paper_width = 210;
module.exports.paper_height = 297;
module.exports.paper_margin = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * 递归复制文件夹
 * @param {string} source_path
 * @param {string} destination
 */
module.exports.copyFolder = function (source_path, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  const files = fs.readdirSync(source_path);
  files.forEach((file) => {
    const sourcePath = path.join(source_path, file);
    const destinationPath = path.join(destination, file);
    if (fs.lstatSync(sourcePath).isDirectory()) {
      module.exports.copyFolder(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
};

/**
 * 递归获取HTML文件
 * @param {string} path
 * @returns {array}
 */
module.exports.dfsScanDir = function (path = '') {
  try {
    if (fs.statSync(path)?.isDirectory()) {
      let child_dir = fs.readdirSync(path, 'utf8');
      let child_file_list = [];
      child_dir.forEach((tem) => {
        child_file_list.push(...module.exports.dfsScanDir(path + '/' + tem));
      });
      return child_file_list;
    } else {
      if (path.indexOf('.html') != -1) {
        Console.log(
          0,
          '【运行日志】扫描到HTML文件【' + (path ?? '未知文件名') + '】'
        );
        return [path];
      }
      return [];
    }
  } catch (err) {
    Console.error('【扫描目录出错】' + err);
  }
  return [];
};

/**
 * 显示信息
 */
module.exports.showEnvironment = function () {
  Console.log(`当前Node版本${process.version}`);
};
