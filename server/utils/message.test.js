const expect = require('expect');
const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct msg obj', () => {
    const from = 'Fabian';
    const text = 'I have to pee.';
    const message = generateMessage(from, text);
    expect(typeof message.createdAt).toEqual('number');
    expect(message).toMatchObject({
      from,
      text
    });
  });
});
