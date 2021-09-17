function onEventBeforePrint() {}

function showPrintGuide() {}

function hidePrintGuide() {}

window.isPrint = true;
window.dispatchEvent(new Event('requestprint'));

window.printReady = function () {
  // updatePrintLine();
  // updatePrintIcon();

  if (window.isPrint && !window.ipadPreview) {
    window.print();
  }
};

window.updatePrintConfig = {
  width: 740,
  height: 1048,
};

function updatePrintLine(params) {}
function removePrintLine(params) {}
function updatePrintIcon(params) {}
function removePrintIcon(params) {}
// /* A4纸 大小定位 遍历 */
// function updatePrintLine() {
//   /* 存起来所有线 */
//   window.printLineArray = window.printLineArray || [];

//   removePrintLine();

//   var maxHeight = Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight);

//   var count =
//     maxHeight % window.updatePrintConfig.height == 0
//       ? parseInt(maxHeight / window.updatePrintConfig.height)
//       : parseInt(maxHeight / window.updatePrintConfig.height) + 1;

//   for (var i = 0; i < count; i++) {
//     var div = document.createElement('div');
//     div.style.position = 'absolute';
//     var page = document.createElement('div');
//     page.style.position = 'absolute';
//     page.style.padding = '0 20px';
//     page.style.lineHeight = '24px';
//     page.style.right = 0;
//     page.style.bottom = 0;
//     page.style.backgroundColor = 'red';
//     page.style.color = '#fff';

//     if (i == 0) {
//       div.style.top = '113px';
//     } else {
//       div.style.top = 113 + i * window.updatePrintConfig.height + 'px';
//       page.innerHTML = '第' + i + '页(共' + count + '页)';
//     }
//     div.style.zIndex = 99999;
//     div.style.left = 0;
//     div.style.width = '100%';
//     div.style.borderTop = '1px dashed red';
//     div.appendChild(page);
//     window.printLineArray.push(div);
//     document.body.appendChild(div);
//   }
// }

// /* 删除打印线 */
// function removePrintLine() {
//   /* 存起来所有线 */
//   window.printLineArray = window.printLineArray || [];

//   /* 如果有线 先删除 */
//   if (window.printLineArray.length) {
//     for (var i = 0, l = window.printLineArray.length; i < l; i++) {
//       document.body.removeChild(window.printLineArray[i]);
//     }
//   }
//   window.printLineArray = [];
// }

// /* 加水印 */
// function updatePrintIcon(fn) {
//   /* 存起来所有的水印 */
//   window.printIconArray = window.printIconArray || [];
//   //屏蔽导学案中牛师帮logo水印；
//   return;
//   removePrintIcon();

//   //("*").css("backgroundColor","none");
//   var topHeight = 113;
//   if (window.isPrint) {
//     topHeight = 0;
//   }

//   var maxHeight = Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight);
//   var count =
//     maxHeight % window.updatePrintConfig.height == 0
//       ? parseInt(maxHeight / window.updatePrintConfig.height)
//       : parseInt(maxHeight / window.updatePrintConfig.height) + 1;

//   for (var i = 0; i < count; i++) {
//     var div = document.createElement('div');
//     var img = document.createElement('img');

//     img.src = '/teacherplatform/static/image/print_icon.png';
//     img.style.width = '100%';

//     div.style.position = 'absolute';
//     if (i == 0) {
//       div.style.top = topHeight + 'px';
//     } else {
//       div.style.top = topHeight + i * window.updatePrintConfig.height + 'px';
//     }
//     div.style.left = '50%';
//     //div.style.background="#f4f4f4";
//     div.style.marginLeft = '-' + window.updatePrintConfig.width / 2 + 'px';
//     div.style.width = window.updatePrintConfig.width + 'px';
//     div.style.height = window.updatePrintConfig.height + 'px';
//     //div.style.overflow = "hidden";

//     if (window.isPrint) {
//       /* 打印水印盖上方 */
//       div.style.zIndex = 99999;
//     }

//     div.appendChild(img);

//     //div.style.backgroundImage = "url()";
//     window.printIconArray.push(div);
//     document.body.appendChild(div);
//   }
//   if (fn) fn();
// }

// function removePrintIcon() {
//   /* 存起来所有水印 */
//   window.printIconArray = window.printIconArray || [];

//   /* 如果有水印 先删除 */
//   if (window.printIconArray.length) {
//     for (var i = 0, l = window.printIconArray.length; i < l; i++) {
//       document.body.removeChild(window.printIconArray[i]);
//     }
//   }
//   window.printIconArray = [];
// }
