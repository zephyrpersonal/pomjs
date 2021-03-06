'use strict';

var _init = function () {
    var _ref = _asyncToGenerator(function* (consulNode) {

        if (consulNode && !consul_node) {
            consul_node = consulNode;
        }

        var checks = yield _consul.health.service({
            service: consul_node,
            passing: true
        });
        var services = {};
        checks[0].forEach(function (c) {
            var s = c.Service;

            var serviceUrl = decodeURIComponent(s.Tags[0]);
            serviceUrl = serviceUrl.substring(serviceUrl.indexOf('Grpc://'));

            var serviceURLObj = URL.parse(serviceUrl, true);
            var service = {
                name: serviceURLObj.pathname.substring(1),
                host: serviceURLObj.host,
                address: s.Address,
                port: s.Port
            };
            Object.assign(service, serviceURLObj.query);
            if (!services[service.name]) {
                services[service.name] = [];
            }
            services[service.name].push(service);
        });

        return services;
    });

    return function _init(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 *{
    name: 'com.quancheng.zeus.service.ProductPackageService',
    host: '10.100.8.110:10013',
    address: '10.100.8.110',
    port: 10013,
    group: 'dev',
    version: '1.0.0'
 }
 *
 * Created by joe on 2016/10/20.
 */

var URL = require('url');

var Bluebird = require('bluebird');

function fromCallback(fn) {
    return new Bluebird(function (resolve, reject) {
        try {
            return fn(function (err, data, res) {
                if (err) {
                    err.res = res;
                    return reject(err);
                }
                return resolve([data, res]);
            });
        } catch (err) {
            return reject(err);
        }
    });
}

var _consul;

var consul_node = void 0;
var _services = {};

module.exports = {

    init: function () {
        var _ref2 = _asyncToGenerator(function* () {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var saluki = opts.saluki || {};

            _consul = require('consul')({
                promisify: fromCallback,
                host: saluki.host || '127.0.0.1',
                port: saluki.port || '8500'
            });
            var group = saluki.group ? 'Saluki_' + saluki.group : 'Saluki_dev';

            console.log('init consul client!');

            var func = function () {
                var _ref3 = _asyncToGenerator(function* () {
                    _services = yield _init(group);
                    setTimeout(func, 10000);
                });

                return function func() {
                    return _ref3.apply(this, arguments);
                };
            }();
            setTimeout(func, 0);
        });

        function init(_x2) {
            return _ref2.apply(this, arguments);
        }

        return init;
    }(),
    setServices: function setServices(services) {
        _services = services;
    },
    getALL: function getALL() {
        return _services;
    }

};