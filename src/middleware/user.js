/**
 *
 * 用户服务，接收用户登陆、注册
 *
 * Created by joe on 16/10/16.
 */
//import uid from "uid-safe";

//const sidKey = 'JSESSIONID';

module.exports = function (opts = {}) {

    return async function user(ctx, next) {

        //
        // if (ctx.path === '/login') {
        //
        //     const userName = ctx.request.body.userName;
        //
        // }
        //
        //
        // // ctx.session = {};
        // console.log(ctx.session.userID);
        //
        // //if (!ctx.session.userID) {
        // ctx.session.userID = '123456';//{userId: '12345', time: (new Date()).timestamp};
        // ctx.session.timestamp = (new Date()).timestamp;
        // // }


        await next();
    }
}