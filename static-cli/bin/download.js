import download from 'download-git-repo'; /* 支持从 Github下载仓库 */
import chalk from 'chalk'; /* 给终端的字体加上颜色 */
import ora from 'ora'; /* 进度显示 */
import symbols from 'log-symbols'; /* 在信息前面加上 √ 或 × 等的图标 */

const repMap = {
  pc: 'pc-tw',
  wap: 'wap-tw',
};

export default async (config) => {
  console.log(symbols.info, chalk.green('创建下载'));
  const loading = ora('正在下载...');
  loading.start();
  return new Promise((resolve, reject) => {
    const url = `direct:https://gitee.com/liejiayong/tw-business-template.git#${repMap[config.tplName]}`,
      dest = `${config.dirPath}`;
    download(url, dest, { clone: true }, (err) => {
      if (err) {
        loading.fail();
        console.log(symbols.error, chalk.red(err));

        reject();
      } else {
        loading.succeed();
        console.log(symbols.success, chalk.green('创建成功'));

        resolve();
      }
    });
  });
};
