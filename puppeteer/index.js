require('dotenv').config({ path: '.env.db' });
const puppeteer = require('puppeteer');
var fs = require('fs');
const { timeout, getRandom } = require('./utils');
const { getPageViewPort, getTopbar, isDBClick } = require('./dom');
const { getFileData } = require('./xlsx');
const docs = 'docs/level8-2.xlsx';
const basePathImg = 'img/level8-2/';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C://Program Files (x86)/Google/Chrome/Application/chrome.exe',
      ignoreHTTPSErrors: true,
      headless: true,
      devtools: false, // 开启开发者控制台
      javascriptEnabled: true,
      acceptSslCerts: true,
      defaultViewport: { width: 1920, height: 1080 },
      // slowMo: 100, //放慢浏览器执行速度，方便测试观察
      //启动 Chrome 的参数，详见上文中的介绍
      args: [
        '–no-sandbox' /* 沙箱功能 */,
        '--disable-extensions' /* 扩展程序 */,
        '--js-flags="--allow-natives-syntax"',
      ],
    });
    console.log(process.env.DB_USER, process.env.DB_PW);
    const page = (await browser.pages())[0];
    await page.goto('https://yunqidi.cn/guide');
    await page.type('#userName', process.env.DB_USER);
    await page.type('#password', process.env.DB_PW);
    await page.mouse.move(1222, 313);
    await page.mouse.down();
    await page.mouse.move(1494, 313);
    await page.mouse.up();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#components-form-demo-normal-login > form > div:nth-child(4) > div > div > span > button', {
        delay: 50,
      }),
    ]);
    // await browser.close();
    console.log(`登录成功--->`);

    const data = await getFileData(docs),
      len = data.length;
    console.log(`加载数据成功---> 数据长度：${len} }`);

    async function capture() {
      console.log(`ready to cap--->`);
      for (let i = 0; i < len; i++) {
        await timeout(getRandom(6000, 16000));
        const curData = data[i],
          title = `${curData.lv}-${curData.classify}-${curData.title}(${curData.group}).pdf`;
        const npage = await browser.newPage();

        await npage.goto(curData.link, {
          waitUntil: 'networkidle0',
        });

        await npage.addStyleTag({
          content: '.jybx_bom2{display: none;}.J_info#pageTop {display: none;}',
        });
        await npage.addScriptTag({ path: 'xss.js' });
        await npage.pdf({
          path: `${basePathImg}${title}`,
          scale: 1,
          format: 'a4',
          displayHeaderFooter: true,
          printBackground: true,
          margin: {
            top: '5mm',
            bottom: '5mm',
            left: '5mm',
            right: '5mm',
          },
          preferCSSPageSize: false,
        });
        const vp = await getPageViewPort(npage);
        await npage.screenshot({ path: `${basePathImg}${title}.png`, clip: vp });
        console.log(`成功！--> ${title}`);
        await npage.close();
      }
      console.log('完成！！！');
    }

    capture();
  } catch (error) {
    console.log('error', error);
  }
})();
