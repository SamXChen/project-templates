/**
 * [Utils 一些公共函数]
 */
var _ = require('lodash');
var crypto = require('crypto');

var Utils = {

    /**
     * 处理restfull url接口
     * 如:
     * /teacher/:courseId/subCourse 
     * 转为 
     * /teacher/f347951525f34441ac6d537b17202660/subCourse
     * @param {string} url 要处理的url
     * @param {object} data 
     * @returns {string} 
     */
    parseRestUrl: function (url, data) {
        var reg = /\/:(\w+)/gi;
        var routeParams = url.match(reg);
        if (_.isEmpty(data)) {
            return url;
        }

        if (!_.isEmpty(routeParams)) {
            _.each(routeParams, function (routeParam, index) {
                var keyName = routeParam.replace('/:', '');
                if (data[keyName]) {
                    url = url.replace(':' + keyName, data[keyName]);
                }
            })
        }
        return url;
    },

    isHttp: function (url) {
        if (_.isEmpty(url)) {
            return false;
        }
        var httpReg = /^(http||https):\/\//;
        return httpReg.test(url);
    },

    // 格式化URL
    parseUrl: function (str, defaultProto) {
        if (!str) {
            return false;
        }

        // 默认使用http
        defaultProto = defaultProto || 'http://';

        if (this.isHttp(str)) {
            return str;
        } else {
            // 清除没用的前缀
            str = str.replace('//', '');
            return defaultProto + str;
        }
    },

    param: function (a) {
        var s = [],
            rbracket = /\[\]$/,
            isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },
            add = function (k, v) {
                v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
                s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
            },
            buildParams = function (prefix, obj) {
                var i, len, key;

                if (prefix) {
                    if (isArray(obj)) {
                        for (i = 0, len = obj.length; i < len; i++) {
                            if (rbracket.test(prefix)) {
                                add(prefix, obj[i]);
                            } else {
                                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                            }
                        }
                    } else if (obj && String(obj) === '[object Object]') {
                        for (key in obj) {
                            buildParams(prefix + '[' + key + ']', obj[key]);
                        }
                    } else {
                        add(prefix, obj);
                    }
                } else if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        add(obj[i].name, obj[i].value);
                    }
                } else {
                    for (key in obj) {
                        buildParams(key, obj[key]);
                    }
                }
                return s;
            };

        return buildParams('', a).join('&').replace(/%20/g, '+');
    },

    paramForSignature: function (a) {
        var s = [],
            rbracket = /\[\]$/,
            isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },
            add = function (k, v) {
                v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;

                k = k.replace(/%/g, '%25');

                if (v.replace) {
                    v = v.replace(/%/g, '%25');
                }

                var temp = encodeURIComponent(decodeURIComponent(k)) + '=' + encodeURIComponent(decodeURIComponent(v));

                //特殊字符处理 Start

                temp = temp.replace(/%2B/g, '+');
                temp = temp.replace(/%2b/g, '+');
                temp = temp.replace(/%20/g, '+');

                temp = temp.replace(/\(/g, '%28');
                temp = temp.replace(/\)/g, '%29');
                temp = temp.replace(/!/g, '%21');
                temp = temp.replace(/~/g, '%7E');

                temp = temp.replace(/\'/g, '%27');

                //特殊字符处理 End

                s[s.length] = temp;
            },
            buildParams = function (prefix, obj) {
                var i, len, key;

                if (prefix) {
                    if (isArray(obj)) {
                        for (i = 0, len = obj.length; i < len; i++) {
                            if (rbracket.test(prefix)) {
                                add(prefix, obj[i]);
                            } else {
                                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                            }
                        }
                    } else if (obj && String(obj) === '[object Object]') {
                        for (key in obj) {
                            buildParams(prefix + '[' + key + ']', obj[key]);
                        }
                    } else {
                        add(prefix, obj);
                    }
                } else if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        add(obj[i].name, obj[i].value);
                    }
                } else {
                    for (key in obj) {
                        buildParams(key, obj[key]);
                    }
                }
                return s;
            };

        return buildParams('', a).join('&').replace(/%20/g, '+');
    },
    crypt: function (text, secret) {
        return crypto.createHmac('sha1', secret).update(text).digest().toString('base64');;
    },
}


module.exports = Utils;
