const readline = require('readline');
const Console = require('node-colour-console');

const { cpu_thread_nums } = require('./global');
let { paper_width, paper_height, paper_margin } = require('./global');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * 输入
 */
module.exports = async function cin() {
  Console.log(`【运行日志】当前CPU有${cpu_thread_nums}个进程`);
  Console.log(
    '【运行日志】请输入【纸张宽度】【纸张高度】【上/右/下/左边距】（默认宽高为A4大小且无边距）'
  );
  Console.log('【运行日志】均使用空格进行分隔且单位均为毫米（mm）');
  return new Promise((resolve) => {
    rl.on('line', function (line) {
      let arr = line.split(' ');
      arr.length >= 1 && arr[0] && (paper_width = arr[0]);
      arr.length >= 2 && arr[1] && (paper_height = arr[1]);
      arr.length >= 3 && arr[2] && (paper_margin.top = arr[2]);
      arr.length >= 4 && arr[3] && (paper_margin.right = arr[3]);
      arr.length >= 5 && arr[4] && (paper_margin.bottom = arr[4]);
      arr.length >= 6 && arr[5] && (paper_margin.left = arr[5]);
      rl.close();
      resolve();
    });
  });
};
