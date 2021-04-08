const alias = (options) => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^${aliases.map(x => escapeRegExp(x)).join('|')}$`);

  return {
    name: 'sf-alias',
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

// 这里里面的东西是 packages/cli-common
export default alias({
  '@nestjs/common': '@starfleet/cli-common',
  '@starfleet/nest-command': '@starfleet/cli-common',
  '@nestjs/core': '@starfleet/cli-common',
  'tslib': '@starfleet/cli-common',
})
