/*
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-22 23:12:54
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-23 11:08:29
 * @FilePath: \HTML转PDF\puppeteer\init.js
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by SQS, All Rights Reserved.
 */
const fs = require('fs');
const { fork } = require('child_process');
const Console = require('node-colour-console');
const process = require('process');

const {
  cpu_thread_nums,
  copyFolder,
  dfsScanDir,
  cache_path,
  chrome_path,
  paper_width,
  paper_height,
  paper_margin,
} = require('./global');
let { all_dir, all_dir_len } = require('./global');

/**
 * 运行环境检查
 */
module.exports.checkEnvironment = async function () {
  if (!fs.existsSync(cache_path)) {
    fs.mkdirSync(cache_path, { recursive: true });
  }
  if (!fs.existsSync(chrome_path)) {
    fs.mkdirSync(chrome_path, { recursive: true });
  }
  return new Promise((resolve, reject) => {
    try {
      fs.access(`${chrome_path}/chrome.exe`, fs.constants.F_OK, (err) => {
        if (err) {
          Console.log('【运行日志】检测到缺少环境依赖', 'BgYellow');
          Console.log('【运行日志】开始安装环境依赖', 'BgYellow');
          copyFolder(`${__dirname}/chrome`, chrome_path);
          Console.log('【运行日志】环境依赖安装完成', 'BgYellow');
          resolve(true);
        } else {
          Console.log('【运行日志】检测到环境依赖已安装', 'BgYellow');
          resolve(true);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.fixEnvironment = function (folder_path = chrome_path) {
  try {
    if (fs.existsSync(folder_path)) {
      fs.readdirSync(folder_path).forEach((file) => {
        const current_path = `${folder_path}/${file}`;
        if (fs.lstatSync(current_path).isDirectory()) {
          module.exports.fixEnvironment(current_path);
          return;
        } else {
          fs.unlinkSync(current_path);
        }
      });
      fs.rmdirSync(folder_path);
    }
    module.exports.checkEnvironment();
    Console.error('【运行日志】修复成功请重新运行');
  } catch (err) {
    Console.error('【错误日志】修复环境失败：' + err);
    Console.error(
      `【运行日志】请收到删除系统根目录下${chrome_path}文件夹：err`
    );
  }
};

/**
 * 扫描目录
 */
module.exports.getDir = function () {
  Console.log('【运行日志】开始扫描当前目录下所有HTML文件', 'BgYellow');
  all_dir = dfsScanDir(process.cwd());
  all_dir_len = all_dir.length;
  Console.log('【运行日志】扫描当前目录下所有HTML文件结束', 'BgYellow');
};

/**
 * 定义主进程计算任务
 */
module.exports.mainTask = async function () {
  // 计算任务分配
  const task_list = [];
  const chunk_size = Math.max(1, Math.ceil(all_dir_len / cpu_thread_nums));
  for (
    let i = 0;
    i < Math.min(Math.ceil(all_dir_len / chunk_size), cpu_thread_nums);
    i++
  ) {
    const start = i * chunk_size;
    const end = Math.min((i + 1) * chunk_size, all_dir_len);
    task_list.push({ start, end });
  }

  const promises = task_list.map((task, index) => {
    const thread_loc = index + 1;
    return new Promise((resolve, reject) => {
      const worker = fork(__dirname + '/worker.js');
      Console.log(`【运行日志】第${thread_loc}个进程已创建`);
      worker.send({
        all_dir,
        start: task.start,
        end: task.end,
        paper_height,
        paper_width,
        paper_margin,
        thread_loc: thread_loc,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(
            new Error(`【错误日志】第${thread_loc}个进程异常退出状态码 ${code}`)
          );
        } else {
          Console.log(`【运行日志】第${thread_loc}个进程已正常退出`);
          resolve();
        }
      });
    });
  });
  await Promise.all(promises);
};

function runFail(err) {
  let is_err = false;
  Console.log('【错误日志】执行任务出错：' + err);
  Console.error('【运行日志】尝试修复中');
  !is_err && module.exports.fixEnvironment();
  is_err = true;
}

module.exports.run = async function () {
  try {
    await module.exports
      .mainTask()
      .then(() => {
        Console.log(
          0,
          '【成功日志】PDF已转换完成（已保存到当前目录的PDF文件夹）'
        );
      })
      .catch((err) => {
        runFail(err);
      });
  } catch (err) {
    runFail(err);
  }
};
