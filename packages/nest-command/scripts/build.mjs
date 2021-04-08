import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

(async () => {
  await esbuild.build({
    entryPoints: ['dist/src/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/nest-command.js',
    keepNames: true,
    plugins: [nodeExternalsPlugin()],
    sourcemap: true
  });
})();
