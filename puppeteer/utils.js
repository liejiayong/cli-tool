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
