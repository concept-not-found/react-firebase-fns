import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'

const min = process.env.NODE_ENV === 'production'

export default {
  input: 'index.js',
  external: ['firebase', 'react'],
  plugins: [
    commonjs(),
    babel({
      externalHelpers: false,
      exclude: 'node_modules/**'
    }),
    min && terser()
  ],
  output: {
    format: 'umd',
    file: `dist/index.umd${min ? '.min' : ''}.js`,
    name: 'ReactFirebaseFns',
    globals: {
      firebase: 'firebase',
      react: 'React'
    }
  }
}
