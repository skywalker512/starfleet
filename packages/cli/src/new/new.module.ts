import { Module } from '@nestjs/common';
import NewCommand from './new.command';

@Module({
  providers: [NewCommand],
})
export class NewModule {}
