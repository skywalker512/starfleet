import esbuild from 'esbuild';

(async () => {
  await esbuild.build({
    entryPoints: ['tmp/index.js'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/starfleet.js',
    minify: true,
    external: [
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
      '@nestjs/platform-express',
      '@nestjs/microservices',
      'class-transformer/storage',
      'cache-manager',
      'class-transformer',
      'class-validator',
    ],
    keepNames: true,
  });
})();
