function getStyleMock() {
  return '<rootDir>/test/__mocks__/style-mock.js';
}

function getfileMock() {
  return '<rootDir>/test/__mocks__/file-mock.js';
}

module.exports = {
  bail: false,
  notify: true,
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',

  //初始化文件
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js',

  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest-nested'
  },
  //匹配相关的测试文件
  testMatch: ['/**/?(*.)+(test).(j|t)s?(x)'],

  //忽略规则
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/.cache-loader/'],

  //匹配到相关规则的文件自定义内容
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': getfileMock(),
    '.*\\.(css|less|scss)$': getStyleMock()
  },
  //收集测试覆盖路径
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/plugins/**',
    '!**/libs/**'
  ]
};
