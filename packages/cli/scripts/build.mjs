import esbuild from 'esbuild';
import alias from '@starfleet-private/esbuild-alias'

(async () => {
  await esbuild.build({
    entryPoints: ['dist/src/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/starfleet.js',
    // minify: true,
    plugins: [
      alias
    ],
    keepNames: true,
    sourcemap: true
  });
})();
