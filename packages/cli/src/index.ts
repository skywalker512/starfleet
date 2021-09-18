import { NestFactory } from '@nestjs/core';
import { CommandModule } from '@starfleet/nest-command';
// import { DynamicImportModule } from '@starfleet/nest-dynamic';
import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace';
import NewCommand from './new/new.command';

@Module({
  imports: [WorkspaceModule.forRoot(), CommandModule.forRoot({ cliName: 'sf' })],
  providers: [NewCommand]
})
class AppModule {
}

(async () => {
  debugger
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error']
  });
})();
