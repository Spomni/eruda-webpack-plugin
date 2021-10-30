const path = require('path')

const { assert } = require('chai')
const webpack = require('webpack')
const webpack_5_0_0 = require('webpack_5.0.0')
const { merge } = require('webpack-merge')

const runCompiler = require('../lib/runCompiler')
const readFileFromDist = require('../lib/readFileFromDist')

const cleanConfig = require('../boilerplate/webpack.config.js')
const contextConfig = require('../config/context')
const defaultConfig = require('../config/default')

describe('ErudaWebpackPlugin', function () {

  this.timeout(7000)
  
  describe('with webpack@latest', function () {
    execSpec({ webpack })
  })
  
  describe('with webpack@5.0.0', function () {
    execSpec({ webpack: webpack_5_0_0 })
  })
})

function execSpec({ webpack }) {

  it('Should do nothing if the webpack mode is not "development".', async function () {
  
    const cleanCompiler = webpack(merge(cleanConfig, contextConfig, {
      mode: 'production',
    }))
  
    const extendCompiler = webpack(merge(cleanConfig, defaultConfig, {
      mode: 'production',
    }))
  
    await runCompiler(cleanCompiler)
    const cleanContent = readFileFromDist('main.js')
    
    await runCompiler(extendCompiler)
    const extendContent = readFileFromDist('main.js')
    
    assert.strictEqual(cleanContent, extendContent)
  })
  
  it('Should inject some code into .js output files.', async function () {
    
    const cleanCompiler = webpack(merge(cleanConfig, contextConfig))
    await runCompiler(cleanCompiler)
    const cleanContent = readFileFromDist('main.js')
  
    const defaultCompiler = webpack(defaultConfig)
    await runCompiler(defaultCompiler)
    const defaultContent = readFileFromDist('main.js')
    
    assert.isAbove(defaultContent.length, cleanContent.length)
  })

}
