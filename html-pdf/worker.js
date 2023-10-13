/*
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-21 15:18:41
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-22 14:22:13
 * @FilePath: \HTML转PDF\worker.js
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const Console = require('sqs-console');
const process = require('process');
const pdf = require('html-pdf');
const path = require('path');
const pdf_dir = `${process.cwd()}/PDF/`;
const fs = require('fs');
process.env.NODE_ENV = 'production';

process.on('message', async (message) => {
    const thread_loc = message?.thread_loc ?? 0;
    await workerTask(message?.all_dir, message?.start, message?.end, message?.paper_width, message?.paper_height, message?.paper_margin, thread_loc);
    Console.log(thread_loc, `【运行日志】第${thread_loc}个进程尝试退出`);
    process.exit(0);
});

/**
 * Worker 进程执行任务
 * @param {int} start 闭区间
 * @param {int} end 开区间
 */
async function workerTask(all_dir = [], start = 0, end = 0, paper_width = 1240, paper_height = 1754, paper_margin = { top: 0, right: 0, bottom: 0, left: 0 }, thread_loc) {
    if (!fs.existsSync(pdf_dir)) {
        fs.mkdirSync(pdf_dir, { recursive: true });
    }
    const all_dir_len = all_dir.length;
    for (let i = Math.max(0, start); i < end && i < all_dir_len; ++i) {
        let html_path = all_dir[i];
        Console.log(thread_loc, '【运行日志】【' + (html_path ?? '未知文件名') + '】开始转换！');
        try {
            const pdf_save_name = html_path.replace(/\.html$/, '.pdf');
            const pdf_name = path.basename(pdf_save_name);
            const new_path = pdf_save_name.replace(process.cwd(), pdf_dir).replace(pdf_name, '');
            if (!fs.existsSync(new_path)) {
                fs.mkdirSync(new_path, { recursive: true });
            }
            const options = { format: 'A4' };
            await new Promise((resolve) => {
                pdf.create(fs.readFileSync(html_path, 'utf-8'), options).toFile(new_path + '/' + pdf_name, function (err) {
                    if (err) {
                        Console.error(0, '【错误日志】【' + (pdf_save_name ?? '未知文件名') + '】转换失败！' + err);
                        resolve();
                    } else {
                        Console.log(thread_loc, '【运行日志】【' + (pdf_save_name ?? '未知文件名') + '】已转换完成！');
                        resolve();
                    }
                });
            });
        } catch (err) {
            Console.error(0, '【错误日志】【' + (pdf_save_name ?? '未知文件名') + '】转换失败！' + err);
            process.exit(1);
        }
    }
}