/**
 * @description:
 * @param {promise} promise实例
 * @param {object} errorExt 错误配置
 * @return {array} [err,data] 返回值
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-12-09 15:27:31
 */
export default (promise, errorExt) => {
    return promise
        .then((data) => [null, data])
        .catch((err) => {
            if (errorExt) {
                const parsedError = Object.assign({}, err, errorExt);
                return [parsedError, undefined];
            }
            return [err, undefined];
        });
};
