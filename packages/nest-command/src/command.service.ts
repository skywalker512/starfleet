import { Argv, CommandModule } from 'yargs';
import { Injectable } from '@nestjs/common';
import { CommandModuleOptions } from './command.interface';

@Injectable()
export class CommandService {
  #yargs?: Argv;
  #running: boolean = false;

  initialize(metadatas: CommandModule[], options: CommandModuleOptions) {
    const { yargs } = this;

    yargs
      .scriptName(options.cliName || process.argv[1])
      .demandCommand(1)
      .help('h')
      .alias('h', 'help')
      .alias('v', 'version')
      .strict();

    metadatas.forEach((command) => {
      yargs.command(command);
    });

    return yargs;
  }

  run() {
    this.#running = true;
  }

  exit(code?: number) {
    this.#running = false;
    process.exit(code);
  }

  get yargs() {
    if (this.#yargs === undefined) {
      this.#yargs = require('yargs');
    }
    return this.#yargs!;
  }

  get isRunning() {
    return this.#running;
  }
}
