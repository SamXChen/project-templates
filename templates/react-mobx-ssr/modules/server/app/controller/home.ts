import { Controller } from 'egg';
import * as fs from 'fs-extra';

let renderCount = 0;

export default class HomeController extends Controller {

  public async main() {

    let html: string = '';
    let storeDataStr: string = 'text inited from node';
    let css: string = '';

    try {
      // 样式
      css = await fs.readFileSync(
        require.resolve('test-app-server-renderer/dist/test-app/css/test-app-style.css'),
        'utf8',
      );

      // html
      const { default: renderer, store } = await import('test-app-server-renderer/dist/test-app/js/test-app');

      // 数据
      store.update(`text inited from node: ${renderCount}`);
      storeDataStr = store.text;

      // renderer 是同步进行得，store 数据用完即弃，不影响下一个请求的处理
      html = renderer();

    } catch (err) {
      console.log(err);
    } finally {
      renderCount++;
    }
    const { ctx } = this;
    await ctx.render('/spa-modules/test-app/views/index.pug', {
      storeStr: storeDataStr,
      htmlStr: html,
      cssStr: css,
    });
  }
}
