const list = [
  { name: 'wap', value: 'wap', description: 'the template is used in the wap terminal' },
  { name: 'pc', value: 'pc', description: 'the template is used in the pc terminal' },
];

export default () => {
  return {
    type: 'list',
    name: 'tplName',
    message: 'option your business code template: ',
    choices: list.slice(),
  };
};
