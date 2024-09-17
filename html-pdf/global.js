const os = require('os');
const fs = require('fs');
const Console = require('node-colour-console');

module.exports.save_phantomjs_path = '/.cache/html-pdf';
module.exports.phantomjs_exe_name = 'phantomjs.exe';
module.exports.cpu_thread_nums = os.cpus().length;
module.exports.pdf_dir = `${process.cwd()}/PDF/`;
module.exports.all_dir = [];
module.exports.all_dir_len = 0;
module.exports.paper_width = 1240;
module.exports.paper_height = 1754;
module.exports.paper_margin = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * 复制文件
 * @param {string} source_path
 * @param {string} destination_dir
 * @param {string} destination_file_name
 */
module.exports.copyFile = function (
  source_path,
  destination_dir,
  destination_file_name
) {
  try {
    if (!fs.existsSync(destination_dir)) {
      fs.mkdirSync(destination_dir, { recursive: true });
    }
    if (fs.lstatSync(source_path)) {
      fs.copyFileSync(
        source_path,
        `${destination_dir}/${destination_file_name}`
      );
    }
  } catch (err) {
    Console.error('【扫描目录出错】' + err);
  }
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
