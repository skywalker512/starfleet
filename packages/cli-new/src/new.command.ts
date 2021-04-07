import { Injectable } from '@nestjs/common';
import { Command, Positional, Prompt } from '@starfleet/nest-command';
import * as console from 'console';

@Injectable()
export default class NewCommand {
  @Command({
    command: 'new [name]',
    describe: 'Generate StarFleet Workspace',
    aliases: 'n',
  })
  async create(
    @Positional({
      name: 'name',
      desc: 'Workspace Name',
    })
    @Prompt({
      type: 'input',
      name: 'name',
      message: 'Workspace Name',
    })
    name: string
  ) {
    console.log(name);
    // await this.userService.add({
    //   username,
    //   group,
    //   saber,
    // });
  }
}
