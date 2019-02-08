const prompts = require('prompts');

module.exports= {
  async get() {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'Enter a code',
      validate: value => value < 18 ? `Nightclub is 18+ only` : true
    });

    return response.value.toUpperCase();
  }
};