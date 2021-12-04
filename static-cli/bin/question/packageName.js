export default () => {
  return {
    type: 'input',
    name: 'packageName',
    message: 'set your package name: ',
    validate: (val) => {
      if (val) return true;
      return 'must set your package name.';
    },
  };
};
