import { Inject, Injectable } from '@nestjs/common';
import { Command, Positional, Prompt } from '@starfleet/nest-command';
import * as console from 'console';
import { WORKSPACE_CONFIG, WorkspaceService } from '@starfleet/workspace';
import { A } from './a';

@Injectable()
export default class NewCommand {
  constructor(private readonly a: WorkspaceService) {
  }

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
    this.a.test()
    // await this.userService.add({
    //   username,
    //   group,
    //   saber,
    // });
  }
}
