/*
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-21 22:18:05
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-22 23:27:27
 * @FilePath: \HTML转PDF\puppeteer\main.js
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by SQS, All Rights Reserved. 
 */
const process = require('process');

const cin = require('./cin');
const { getDir, checkEnvironment, run } = require('./init');
const { showEnvironment } = require('./global');

process.env.NODE_ENV = 'production';

(async () => {
    showEnvironment();
    await cin();
    await checkEnvironment();
    getDir();
    await run();
})();
