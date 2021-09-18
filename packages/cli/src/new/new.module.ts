import { Module } from '@nestjs/common';
import NewCommand from './new.command';


@Module({
  imports: [],
  providers: [NewCommand],
})
export class NewModule {}
