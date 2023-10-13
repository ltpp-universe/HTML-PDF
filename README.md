<!--
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-18 18:30:44
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-23 09:14:05
 * @FilePath: \HTML转PDF\README.md
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
# 批量HTML转PDF
#### 说明
> 一共两个独立版本，html-pdf目录下是基于html-pdf模块开发的应用，puppeteer目录下是基于puppeteer模块开发的应用

#### 安装
> npm i

#### 运行
- 1.对于html-pdf，双击exe文件运行（仅适用于win-x64）
- 2.对于puppeteer，由于打包后exe过大无法上传git仓库，请用户自行根据下面的打包方法进行打包
- 2.如果系统有node环境并且安装了npm，可以使用命令npm run start直接运行

#### 针对puppeteer进行打包（对于html-pdf开发的应用，由于pkg对于可执行文件的限制策略暂时不可用，puppeteer可以使用下面的命令打包）
> 打包时间可能很久请耐心等待，因为需要打包的资源很大并且进行压缩处理，时间消耗较多
- 1.首次打包需要运行以下命令
> npm run install-pkg
- 2.解压chrome.7z
- 3.运行打包命令，会在项目根目录生成exe可执行文件
> npm run pkg

#### 使用说明
- 使用多进程将HTML转成PDF
- 递归自动扫描项目下的所有目录获取所有HTML文件
- PDF目录（系统会自动创建）存储转换后的PDF文件（PDF存储位置根据获取的HTML目录相对位置递归创建文件夹存储PDF文件，保证和原来目录结构相同）
- 如果PDF重复会覆盖旧的内容
- 对于基于puppeteer开发的应用，添加环境自动检测和修复功能