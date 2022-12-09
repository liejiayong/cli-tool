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
