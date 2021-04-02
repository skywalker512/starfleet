import { NestFactory } from '@nestjs/core';
import { CommandModule } from '@starfleet/nest-command';
import { Module } from '@nestjs/common';

import { NewModule } from './new';

@Module({
  imports: [CommandModule.forRoot({ cliName: 'sf' }), NewModule],
})
class AppModule {}

(async () => {
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
})();
