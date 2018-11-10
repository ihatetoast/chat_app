const expect = require('expect');
const { generateMessage, generateGeoLocMessage } = require('./message');

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

describe('generateGeoLocMessage', () => {
  it('should generage correct location obj', () => {
    const from = 'Admin';
    const lat = -27.481106;
    const long = 153.0632767;
    const url = 'https://www.google.com/maps?q=-27.481106,153.0632767';
    const geoMsg = generateGeoLocMessage(from, lat, long);
    expect(typeof geoMsg.createdAt).toEqual('number');
    expect(typeof url).toEqual('string');
    expect(geoMsg).toMatchObject({ from, url });
  });
});
