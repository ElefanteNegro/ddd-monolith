// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@Shared/(.*)$': '<rootDir>/src/Modules/Shared/$1',
      '^@Modules/(.*)$': '<rootDir>/src/Modules/$1',
      '^@User/(.*)$': '<rootDir>/src/Modules/User/$1'
    }
};
  