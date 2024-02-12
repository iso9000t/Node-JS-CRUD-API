import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.cjs',
    path: path.resolve(__dirname, 'dist'),
  },
};
