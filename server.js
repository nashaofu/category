/*!
 * 静态文件服务器
 * Copyright 2016 程刁
 * Licensed under MIT
 */
'use strict';
// http模块
const http = require('http');
// url模块
const url = require('url');
// 路径模块
const path = require('path');
// 文件系统模块
const fs = require('fs');
// 服务器配置
let CONFIG = {
    // 服务器端口
    port: process.argv[2] || 8080,
    // 网站根目录
    root: __dirname,
    // 默认文档
    filename: 'index.html',
    // 响应状态
    status: {
        200: 'OK',
        404: '404 Not Found',
        400: '400 Bad Request',
        403: '403 Forbidden',
        405: '405 Method Not Allowed',
        301: '301 Moved Permanently',
        304: '304 Not Modified',
        500: '500 Internal Server Error',
        502: '502 Bad Gateway'
    }
};
// 创建http服务器
let server = http.createServer((req, res) => {
    // 路径名
    let pathname = url.parse(req.url).pathname;
    if (pathname.slice(-1) === '/') {
        pathname += CONFIG.filename;
    }
    // 去掉路径中的../,以保证安全性
    pathname = path.normalize(pathname.replace(/\.\./g, ''));
    // 文件名
    let filename = path.join(CONFIG.root, pathname);
    // 异步获取文件信息
    fs.stat(filename, (err, stats) => {
        // 定义状态码
        let status = null;
        if (!err && (stats.isDirectory() || stats.isFile())) {
            // 判断是否为文件夹
            if (stats.isDirectory()) {
                // 判断是否以"/"结尾
                if (/\/$/.test(req.url)) {
                    // 返回默认文件
                    filename = path.normalize(filename + '/' + CONFIG.filename);
                } else {
                    // 重定向
                    status = 301;
                    res.writeHead(status, {
                        Location: pathname + "/"
                    });
                }
            }
            fs.exists(filename, (exists) => {
                if (exists) {
                    fs.stat(filename, (err, stats) => {
                        if (!err && stats.isFile()) {
                            // 正常返回数据
                            status = 200;
                            res.writeHead(status);
                            fs.createReadStream(filename).pipe(res);
                        } else {
                            // 找不到请求内容
                            status = 404;
                            res.writeHead(status);
                            res.end('404 Not Found');
                            console.log(status + '  ' + req.url);
                        }
                    });
                } else {
                    // 找不到请求内容
                    status = 404;
                    res.writeHead(status);
                    res.end('404 Not Found');
                    console.log(status + '  ' + req.url);
                }
            });
        } else {
            // 找不到请求内容
            status = 404;
            res.writeHead(status);
            res.end('404 Not Found');
            console.log(status + '  ' + req.url);
        }
    });
});
// 监听端口
server.listen(CONFIG.port);
console.log('Server is running at http://127.0.0.1:' + CONFIG.port + '/');