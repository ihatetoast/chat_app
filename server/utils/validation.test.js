const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject values that are not real strings', () => {
    const search = isRealString(666);
    expect(search).toBeFalsy();
  });
  it('should reject values that are only spaces', () => {
    const search = isRealString('          ');
    expect(search).toBeFalsy();
  });

  it('should trim values', () => {
    const search = isRealString('   weetwoo');
    expect(search).toBeTruthy();
  });

  it('should accept strings with spaces inside', () => {
    const search = isRealString("stay sexy and don't get murdered!");
    expect(search).toBeTruthy();
  });
  it('should accept strings with non-space characters', () => {
    const search = isRealString('f@&king hurray');
    expect(search).toBeTruthy();
  });
});
