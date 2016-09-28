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
// 服务器类
class Server {
    // 构造方法
    constructor(options) {
        let me = this;
        // 获取配置
        me.config = me.extend({}, Server.config, typeof options === 'object' && options);
        // 创建http服务器
        me.server = http.createServer((req, res) => {
            res.setHeader('Server', 'Node/V6');
            // 路径名
            me.pathname = url.parse(req.url).pathname;
            // 判断请求的是否为目录
            if (me.pathname.slice(-1) === '/') {
                me.pathname += me.config.filename;
            }
            // 防止访问根目录以上的文件
            me.pathname = path.normalize(me.pathname.replace(/\.\./g, ''));
            // 文件名
            me.filename = path.join(me.config.root, me.pathname);
            me.stat(me.filename, (err, file) => {
                // http状态码
                let status;
                me.filename = file.fname;
                if (err) {
                    // 设置状态码为404
                    status = 404;
                    res.writeHead(status);
                    res.end(me.config.status[status]);
                } else {
                    if (file.isDirectory()) {
                        // 设置状态码为301
                        status = 301;
                        // 设置响应头
                        res.writeHead(status, {
                            'Location': me.pathname + '/'
                        });
                        res.end(me.config.status[status]);
                    } else {
                        // 文件后缀名
                        let ext = path.extname(file.fname).slice(1);
                        // 设置状态码为200
                        status = 200;
                        // 设置响应头
                        res.writeHead(status, {
                            'Content-Type': (me.config.mime[ext] || me.config.mime['unknown']) + ';charset=' + me.config.charset,
                            'Content-Length': file.size,
                            'Last-Modified': file.mtime.toUTCString()
                        });
                        fs.createReadStream(file.fname).pipe(res);
                    }
                }
                console.log(status + '  ' + req.url);
            });
        }).listen(me.config.port);
        // 打印服务器启动成功信息
        console.log('Server is running at http://127.0.0.1:' + me.config.port + '/');
    };
    // 获取文件名
    stat(filename, callback) {
        var me = this;
        // 异步获取文件信息
        fs.stat(filename, (err, stats) => {
            // 文件信息
            let file = me.extend({
                'fname': filename
            }, typeof stats === 'object' && stats);
            if (err) {
                callback(err, file);
            } else {
                callback(err, file);
            }
        });
    };
    // 替换对象属性
    extend() {
        let i = 0;
        while (i < arguments.length) {
            if (typeof arguments[0] === 'object' && typeof arguments[i + 1] === 'object') {
                for (let key in arguments[i + 1]) {
                    arguments[0][key] = arguments[i + 1][key];
                }
            }
            i++;
        }
        return arguments[0];
    }
};
// 服务器默认配置
Server.config = {
    // 服务器端口
    port: process.argv[2] || 8080,
    // 网站根目录
    root: 'demo',
    // 默认文档
    filename: 'index.html',
    // 响应状态
    status: {
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '208': 'Already Reported',
        '226': 'IM Used',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '306': '(Unused)',
        '307': 'Temporary Redirect',
        '308': 'Permanent Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Payload Too Large',
        '414': 'URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '421': 'Misdirected Request',
        '422': 'Unprocessable Entity',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '425': 'Unordered Collection',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '508': 'Loop Detected',
        '509': 'Bandwidth Limit Exceeded',
        '510': 'Not Extended',
        '511': 'Network Authentication Required'
    },
    charset: 'utf-8',
    mime: {
        'css': 'text/css',
        'gif': 'image/gif',
        'html': 'text/html',
        'ico': 'image/x-icon',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'js': 'text/javascript',
        'json': 'application/json',
        'pdf': 'application/pdf',
        'png': 'image/png',
        'svg': 'image/svg+xml',
        'swf': 'application/x-shockwave-flash',
        'tiff': 'image/tiff',
        'txt': 'text/plain',
        'wav': 'audio/x-wav',
        'wma': 'audio/x-ms-wma',
        'wmv': 'video/x-ms-wmv',
        'xml': 'text/xml',
        'unknown': 'text/plain'
    }
};
// 创建服务器对象
let server = new Server();