export default () => {
  return {
    type: 'input',
    name: 'dirName',
    message: 'set the project folder. DEFAULT by',
    default: () => {
      return './';
    },
  };
};
