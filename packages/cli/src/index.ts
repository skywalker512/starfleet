import { NestFactory } from '@nestjs/core';
import { CommandModule } from '@starfleet/nest-command';
import { DynamicImportModule } from '@starfleet/nest-dynamic';
import { Module } from '@nestjs/common';
import { WorkspaceModule } from '@starfleet/workspace';

@Module({
  imports: [CommandModule.forRoot({ cliName: 'sf' }), DynamicImportModule.registerPluginsAsync(), WorkspaceModule.forRoot()]
})
class AppModule {
}

(async () => {
  debugger
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error']
  });
})();
