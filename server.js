/**
 * 创建一个简单的静态文件服务器
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
    port: 8080,
    // 网站根目录
    root: __dirname,
    // 默认文档
    filename: 'index.html'
};
// 创建http服务器
let server = http.createServer(function(req, res) {
    // 路径名
    let pathname = url.parse(req.url).pathname;
    // 文件名
    let filename = path.join(CONFIG.root, pathname);
    // 异步获取文件信息
    fs.stat(filename, function(err, stats) {
        // 定义状态码
        let status = null;
        if (!err) {
            // 判断是否为文件夹
            filename = stats.isDirectory() ? filename + CONFIG.filename : filename;
            // 状态码设置为200
            status = 200;
            // 返回数据
            res.writeHead(status);
            fs.createReadStream(filename).pipe(res);
        } else {
            // 状态码设置为404
            status = 404;
            // 返回数据
            res.writeHead(status);
            res.end('404 Not Found');
        }
        // 打印日志
        console.log(status +'  '+ req.url);
    });
});
// 监听端口
server.listen(CONFIG.port);
console.log('Server is running at http://127.0.0.1:' + CONFIG.port + '/');