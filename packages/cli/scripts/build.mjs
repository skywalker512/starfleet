import esbuild from 'esbuild';

const alias = (options) => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^${aliases.map(x => escapeRegExp(x)).join('|')}$`);

  return {
    name: 'alias',
    setup(build) {
      build.onResolve({ filter: re }, args => ({
        path: options[args.path], external: true
      }));
    },
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

(async () => {
  await esbuild.build({
    entryPoints: ['dist/src/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/starfleet.js',
    // minify: true,
    plugins: [
      alias({
        '@nestjs/common': '@starfleet/cli-common',
        '@starfleet/nest-command': '@starfleet/cli-common',
        '@nestjs/core': '@starfleet/cli-common',
        'tslib': '@starfleet/cli-common',
      }),
    ],
    keepNames: true,
    sourcemap: true
  });
})();
