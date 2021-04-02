import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

(async () => {
  await esbuild.build({
    entryPoints: ['tmp/lib/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/nest-command.js',
    keepNames: true,
    plugins: [nodeExternalsPlugin()],
  });
})();
