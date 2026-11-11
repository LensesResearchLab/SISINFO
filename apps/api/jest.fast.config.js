module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: '<rootDir>/../tsconfig.test.json',
      diagnostics: false,
      isolatedModules: true,
    }],
  },
  testEnvironment: 'node',
  maxWorkers: 1,
  forceExit: true,
};
