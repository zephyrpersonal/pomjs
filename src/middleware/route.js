/**
 * 定义API解析、调用,只处理 后缀为.json 并且 method为get
 *
 * 系统自动查找api的目录,默认查找应用根目录下的 server/api
 *
 * api url 规则:
 *   http://domain:port/xxx.json route 到  server/api/index.js -> xxx function
 *   http://domain:port/aaa/xxx.json route 到  server/api/aaa.js
 * Created by joe on 16/9/23.
 */

import fs from 'fs';
import Path from 'path';
const apis = {};
const apiFiles = {};
const glob = require('glob-fs')({gitignore: true});


export default function (opts = {}) {

    const files = glob.readdirSync('/pages/*/index.js');

    files.forEach(function (f) {
        let a = Path.join(opts.root, f);
        apiFiles[a] = true;
    });


    return async function (ctx, next) {
        const path = ctx.path, ext = "";

        // 请求路径 /view.html ==> view
        const viewPath = path.substring(1, path.length - 5);
        //请求后缀 html
        const viewExt = path.substring(path.length - 4);

        if ((viewExt !== 'json' && viewExt !== 'html') || viewPath === '') {
            await next();
            return;
        }

        if (viewExt === 'html') {
            ctx.type = 'text/html; charset=utf-8';
        }

        let filePath = opts.root + "/pages/";
        let action = viewPath;
        let page = 'index';
        if (viewPath.indexOf('/') == -1) {
            filePath += 'index/index.js';
        } else {
            page = viewPath.substring(0, viewPath.indexOf('/'));
            filePath += page + '/index.js';
            action = viewPath.substring(viewPath.indexOf('/') + 1);
        }

        let api = apis[filePath];
        if (!api) {
            if (fs.existsSync(filePath)) {
                //api = apis[filePath] = new (require(filePath)).default();
                delete require.cache[filePath];
                api =  new (require(filePath)).default();
            } else {
                await next();
                return;
            }
        }

        ctx.status = 200;

        const context = Object.assign({}, ctx._httpContext);

        let result = api[action].call(context, ctx);

        if (typeof result === 'object') {
            if (viewExt === 'json') {
                ctx.body = JSON.stringify(result);
                return;
            } else {
                ctx._context = result;
                ctx._page = page;
            }
        }

        await next();
    }
}