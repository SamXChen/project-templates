import arr from './index';

test('test index', () => {
    expect(Array.isArray(arr)).toBe(true)
    expect(arr.length).toBe(5)
});