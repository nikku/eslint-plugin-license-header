import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    '.nyc_output',
    'coverage'
  ],
  build: [
    '*.js',
    '*.mjs'
  ],
  test: [
    'tests/**/*.js'
  ]
};

export default [
  {
    ignores: files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      files: files.build
    };
  }),

  // lib + test
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: files.build
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  }),

  {
    files: files.test,
    rules: {
      'mocha/no-async-describe': 'off',
      'mocha/no-mocha-arrows': 'off',
      'mocha/consistent-spacing-between-blocks': 'off'
    }
  },

  // all files
  {
    files: [ '**/*.js' ],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];