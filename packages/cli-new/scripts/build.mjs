import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

(async () => {
  await esbuild.build({
    entryPoints: ['dist/src/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/cli-new.js',
    minify: true,
    plugins: [nodeExternalsPlugin()],
    keepNames: true,
    sourcemap: true
  });
})();
