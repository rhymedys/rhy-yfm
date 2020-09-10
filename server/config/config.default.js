'use strict';
const path = require('path');

module.exports = appInfo => {

  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532412204088_5443';

  // add your config here
  config.middleware = [];

  config.cluster = {
    listen: {
      port: 7003, // 端口
      hostname: '0.0.0.0', // 你的IP
    },
  };

  // config.middleware = [ 'checkSession' ];

  config.security = {
    csrf: {
      useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      enable: false,
    },
    xframe: {
      enable: false,
    },
    domainWhiteList: [
      'http://localhost:7003',
      'https://test3.mhealth100.com',
      'http://test3.mhealth100.com',
    ],
  };

  // // config/config.prod.js
  config.assets = {
    publicPath: '/public/',
  };

  console.log(path.join(__dirname, '../public'));


  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(','),
    mapping: {
      '.ejs': 'ejs',
    },
  };


  console.log(path.join(__dirname, '../public'));

  config.static = {
    // maxAge: 31536000,
    dir: [{
      prefix: '/hm-dev-platform/public',
      dir: path.join(__dirname, '../../public'),
    },
    {
      prefix: '/public',
      dir: path.join(__dirname, '../app/public'),
    },
    {
      prefix: '/static2',
      dir: path.join(__dirname, '../public'),
    },
    ],
  };


  return config;
};
