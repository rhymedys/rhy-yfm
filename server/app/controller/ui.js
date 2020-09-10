'use strict';

const Controller = require('egg').Controller;

class UIContorller extends Controller {
  async pc() {
    await this.ctx.render(
      'pc/index.ejs'
    );
  }
}

module.exports = UIContorller;
