const sum = require('./sum');

test('adds 1 + 2 to equal 33', () => {
  expect(sum(1, 2)).toBe(3);
})
