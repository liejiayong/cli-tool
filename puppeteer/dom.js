exports.getPageViewPort = async (page) => {
  const dimensions = await page.evaluate(() => {
    return {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    };
  });
  return dimensions;
};

exports.getTopbar = async (page) => {
  var is = await page.$('#pageTop');
  if (!is) return;
  var ls = await page.$$eval('#pageTop .i_version .v_btn', (el) => {
    var ret = [];
    ret = el.map((item) => {
      return {
        text: item.innerHTML,
        active: item.classList.contains('active'),
      };
    });
    return ret;
  });
  return ls || [];
};

exports.isDBClick = async (page, fn) => {
  // var doc = await.$
};
