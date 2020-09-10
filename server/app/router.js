/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-24 11:16:52
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-09-10 20:47:42
 */

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app;
  router.get('/hm-dev-platform/', controller.home.index);
  router.get('/hm-dev-platform/h5/pc/*', controller.ui.pc);
};
