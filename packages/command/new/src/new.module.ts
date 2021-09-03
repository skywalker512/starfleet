import { Module } from '@nestjs/common';
import NewCommand from './new.command';
import { A } from './a';


@Module({
  imports: [],
  providers: [NewCommand, A],
})
export class NewModule {}
