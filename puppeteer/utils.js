exports.timeout = function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

exports.getRandom = function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

async function deal(target, label, browser) {
  clickCount = 0;

  const page = await target.page();

  if (!target.url().includes('/online/view_lecture')) {
    console.log(target.url(), 'no pdf');
    return;
  }
  await page.waitForSelector('#pageTop', { timeout: 0 });
  console.log('clickCount', clickCount);

  page.on('load', async () => {
    console.log('page load');
    await page.waitForTimeout(2000);
    await Promise.all([page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' })]);
    const titleArr = [titleArrTemp];
    // const title = await page.title();
    const url = await page.url();
    var topbar = (await getTopbar(page)) || [],
      curTopBar = {};
    topbar.forEach((item) => {
      if (item.active) {
        curTopBar = item;
      }
    });
    var $head = await page.$('.J_header h2'),
      $tag = await page.$('.J_header h2 span');
    if ($head) {
      let tit = await page.$eval('.J_header h2', (el) => el.innerHTML),
        tag = '',
        index = tit.indexOf('<span');
      console.log(label, tit, index);
      if (index > -1) {
        // if ($tag) {
        //   tag = await page.$eval('.J_header h2 span', (el) => el.innerHTML);
        // }
        // tit = tit.substring(0, index) + tag;
        tit = tit.substring(0, index) + curTopBar.text;
      }
      titleArr.push(tit);
    }
    let title = titleArr.join('');
    // await page.bringToFront();
    console.log(label, title);
    const vp = await getPageViewPort(page);
    console.log('vp0', vp);
    await page.mouse.move(0, 0);
    await page.mouse.move(0, vp.height);
    // await page.screenshot({ path: `${basePathImg}create_${title}_.png`, clip: vp });
    // await page.pdf({ path: `${basePathImg}create_${title}_.pdf`, format: 'A4' });
    await page.waitForTimeout(1000);
    const html = await page.content();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${basePathImg}${title}_.png`, fullPage: true });
    // html2pdf(html, `${basePathImg}${title}_.pdf`);

    /* test pdf */
    const npage = await browser.newPage();
    await getPageViewPort(npage);
    await npage.goto(url, {
      waitUntil: 'networkidle2',
    });
    await npage.pdf({ path: `${basePathImg}${title}_.pdf`, format: 'a4' });
    await npage.close();
  });
}

var phantomHtml2pdf = require('phantom-html2pdf');
var nodePdf = require('pdf-creator-node');
var pdf = require('html-pdf');
async function html2pdf(html, filePath) {
  // pdf.create(html).toStream(function (err, stream) {
  //   if (err) return console.warn('html2pdf create error');
  //   stream.pipe(fs.createWriteStream(filePath));
  // });
  // phantomHtml2pdf.convert(
  //   {
  //     html,
  //   },
  //   function (err, result) {
  //     /* Using a buffer and callback */
  //     result.toBuffer(function (returnedBuffer) {});
  //     /* Using a readable stream */
  //     var stream = result.toStream();
  //     /* Using the temp file path */
  //     var tmpPath = result.getTmpPath();
  //     /* Using the file writer and callback */
  //     result.toFile('img/file.pdf', function () {});
  //   }
  // );
  nodePdf
    .create(
      {
        html: html,
        data: {
          users: [
            {
              name: 'JyLie',
              age: '18',
            },
          ],
        },
        path: filePath,
        type: '',
      },
      { format: 'A4', orientation: 'portrait' }
    )
    .then((res) => {
      console.log(filePath, res);
    })
    .catch((error) => {
      console.error(error);
    });
}
