import {
  DynamicModule,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { CommandService } from './command.service';
import { CommandExplorerService } from './command-explorer.service';
import { CommandModuleOptions } from './command.interface';
import { COMMAND_MODULE_OPTIONS, COMMAND_SERVER } from './command.constants';
import { ModuleRef } from '@nestjs/core';
import { Argv } from 'yargs';

@Module({
  providers: [CommandService, CommandExplorerService, MetadataScanner],
})
export class CommandModule implements OnApplicationBootstrap {
  public static forRoot(options: CommandModuleOptions = {}): DynamicModule {
    return {
      exports: [CommandService],
      module: CommandModule,
      providers: this.createProviders(options),
    };
  }

  private static createProviders(options: CommandModuleOptions): Provider[] {
    return [
      {
        provide: COMMAND_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: COMMAND_SERVER,
        useFactory: (
          options: CommandModuleOptions,
          cliService: CommandService,
          commandExplorerService: CommandExplorerService
        ) => {
          return cliService.initialize(
            commandExplorerService.explore(),
            options
          );
        },
        inject: [
          COMMAND_MODULE_OPTIONS,
          CommandService,
          CommandExplorerService,
        ],
      },
    ];
  }

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationBootstrap(): any {
    const argv = this.moduleRef.get<Argv<{}>>(COMMAND_SERVER);
    argv.argv;
  }
}
