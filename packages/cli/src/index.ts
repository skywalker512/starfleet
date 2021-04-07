import { NestFactory } from '@nestjs/core';
import { CommandModule } from '@starfleet/nest-command';
import { DynamicImportModule } from '@starfleet/nest-dynamic'
import { Module } from '@nestjs/common';

@Module({
  imports: [CommandModule.forRoot({ cliName: 'sf' }), DynamicImportModule.registerPluginsAsync()],
})
class AppModule {}

(async () => {
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
})();
