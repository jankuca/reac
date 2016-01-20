var rollup = require('rollup').rollup
var commonjs = require('rollup-plugin-commonjs')
var npm = require('rollup-plugin-npm')

rollup({
  entry: 'example/lib/example.js',
  plugins: [
    npm({
      jsnext: true,
      main: true
    }),

    // non-CommonJS modules will be ignored, but you can also
    // specifically include/exclude files
    commonjs({
      include: 'node_modules/**',
      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: [ '.js', '.coffee' ] // defaults to [ '.js' ]
    })
  ]
}).then(
  function (bundle) {
    bundle.write({
      dest: 'example/build/example.js'
    })
  },
  function (err) { console.log('err', err) }
)
