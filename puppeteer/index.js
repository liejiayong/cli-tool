const puppeteer = require('puppeteer');
const { getPageViewPort } = require('./utils');

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    slowMo: 100, //放慢浏览器执行速度，方便测试观察
    //启动 Chrome 的参数，详见上文中的介绍
    args: ['–no-sandbox' /* 沙箱功能 */, '--disable-extensions' /* 扩展程序 */],
  });
  browser.on('targetcreated', async (target) => {
    const page = await target.page();
    const title = await page.title();
    const url = await page.url();
    console.log('targetcreated1', url, title);
    // await page.bringToFront();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('targetcreated2', url, title);
    console.log('targetcreated3', url, title);
    const vp = await getPageViewPort(page);
    console.log('vp', vp);
    await page.mouse.move(0, 0);
    await page.mouse.move(0, vp.height);
    // await page.screenshot({ path: `example_change_${title}_.png`, fullPage: true });
    await page.screenshot({ path: `example_change_${title}_.png`, clip: vp });
    return Promise.resolve();
  });
  browser.on('targetchanged', async (target) => {
    const page = await target.page();
    const title = await page.title();
    const url = page.url();
    console.log('targetchanged', url, title);

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const vp = await getPageViewPort(page);
    console.log('vp', vp);
    await page.mouse.move(0, 0);
    await page.mouse.move(0, vp.height);
    // await page.screenshot({ path: `example_change_${title}_.png`, fullPage: true });
    await page.screenshot({ path: `example_change_${title}_.png`, clip: vp });
    return Promise.resolve();
  });

  const page = await browser.newPage();
  // await page.setViewport({ width: 1980, height: 1080 });
  await page.goto('https://gitee.com/liejiayong');
  // await browser.close();
})();
