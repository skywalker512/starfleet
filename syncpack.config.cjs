/** @type {import('syncpack/dist/constants').SyncpackConfig} **/
module.exports = {
  sortAz: ['contributors', 'dependencies', 'devDependencies', 'keywords', 'peerDependencies', 'scripts'],
  sortFirst: ['name', 'description', 'version', 'author'],
  source: ['packages/*/package.json']
};
