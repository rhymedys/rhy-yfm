/**
 * 生产环境配置
 *
 * 最终生效的配置为 prod + default（前者覆盖后者）
 */
'use strict';

const path = require('path');


module.exports = appInfo => {
  const exports = {};
  exports.logger = {
    consoleLevel: 'ERROR',
    dir: path.join(appInfo.baseDir, 'logs/server_hm_dev_platform'),
  };


  return exports;
};
