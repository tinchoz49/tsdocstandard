var path = require('path')
var json5 = require('json5')
var fs = require('fs')
var pkg = require('./package.json')

module.exports = {
  // cmd, homepage, bugs all pulled from package.json
  cmd: 'tsdocstandard',
  version: pkg.version,
  homepage: pkg.homepage,
  bugs: pkg.bugs.url,
  tagline: 'JavaScript + Typescript + JSDoc',
  eslint: require('eslint'),
  eslintConfig: {
    configFile: path.join(__dirname, 'eslintrc.json')
  },
  parseOpts: (opts, packageOpts, rootDir) => {
    opts.eslintConfig = opts.eslintConfig || {}
    opts.eslintConfig.parserOptions = opts.eslintConfig.parserOptions || {}

    const cwd = opts.cwd || process.cwd()
    opts.eslintConfig.parserOptions.tsconfigRootDir = cwd
    opts.eslintConfig.parserOptions.project = './tsconfig.json'

    const tsconfigText = fs.readFileSync(
      path.join(cwd, 'tsconfig.json')
    )
    const obj = json5.parse(tsconfigText)
    if (!obj.compilerOptions || !obj.compilerOptions.allowJs) {
      throw new Error("Expected your tsconfig.json to contain \"allowJs\": true")
    }
    if (!obj.compilerOptions || !obj.compilerOptions.checkJs) {
      throw new Error("Expected your tsconfig.json to contain \"checkJs\": true")
    }

    if (opts.filename && opts.filename.indexOf('file://') === 0) {
      opts.filename = opts.filename.slice(7)
    }

    return opts
  }
}
