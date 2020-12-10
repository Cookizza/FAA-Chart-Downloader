const prompts = require('prompts');

module.exports = {
  async get(choices) {

    const res = await prompts([
      {
        type: 'select',
        name: 'source',
        message: 'Please select a chart source',
        choices: choices,
      },
      {
        type: 'text',
        name: 'code',
        message: 'Enter an airport code'
      },
      {
        type: 'select',
        name: 'overwrite',
        message: 'Overwrite if file exists?',
        choices: [
          { title: 'yes', value: true },
          { title: 'no', value: false },
        ]
      }
    ]);

    return { source: res.source, code: res.code.toUpperCase(), overwrite: res.overwrite };
  }
};
