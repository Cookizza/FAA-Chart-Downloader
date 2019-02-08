const prompts = require('prompts');

module.exports= {
  async get() {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'Enter an airport code'
    });

    return response.value.toUpperCase();
  },
  async save() {

  }
};