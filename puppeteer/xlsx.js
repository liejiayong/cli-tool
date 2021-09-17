const Excel = require('exceljs');

async function getWorksheet(path, sheet = 1) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(path);
  const worksheet = workbook.getWorksheet(sheet);
  return worksheet;
}

exports.getFileData = async function getFileData(path) {
  const col = ['A', 'B', 'C', 'D', 'E'],
    map = { A: 'lv', B: 'group', C: 'classify', D: 'title', E: 'link' };
  const worksheet = await getWorksheet(path),
    rowCount = worksheet.rowCount;

  let cur = 2,
    ret = [];

  while (cur < rowCount) {
    let curMap = {};
    col.forEach((item) => {
      const label = map[item],
        vLabel = `${item}${cur}`;
      curMap[label] = worksheet.getCell(vLabel).value;
    });
    ret.push(curMap);
    cur++;
  }
  return ret;
};
