import { NestFactory } from '@nestjs/core';
import { Command, CommandModule, Option, Prompt } from '../lib';
import { Module } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class UserService {
  async add(user: any): Promise<any> {
    return Promise.resolve().then(() => {
      console.log('user added:', user, process.argv);
    });
  }
}

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'create:user',
    describe: 'create a user',
  })
  async create(
    @Option({
      name: 'group',
      describe: 'user group (ex: "jedi")',
      type: 'string',
      alias: 'g',
      required: false,
    })
    group: string,
    @Option({
      name: 'saber',
      describe: 'if user has a lightsaber',
      type: 'boolean',
      default: false,
      required: false,
    })
    saber: boolean,

    @Prompt({
      type: 'input',
      name: 'username',
      message: 'What is your username?',
    })
    username: string
  ) {
    await this.userService.add({
      username,
      group,
      saber,
    });
  }
}

@Module({
  imports: [CommandModule.forRoot({ cliName: 'aa' })],
  providers: [UserCommand, UserService],
})
class AppModule {}

(async () => {
  await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
})();
