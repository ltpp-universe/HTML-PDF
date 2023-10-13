/*
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-11 13:07:01
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-23 10:07:29
 * @FilePath: \HTML转PDF\html-pdf\main.js
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
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