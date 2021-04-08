import { CommandModule, Argv, Arguments } from 'yargs';
import { Injectable } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Injectable as IInjectable } from '@nestjs/common/interfaces';
import {
  COMMAND_HANDLER_METADATA,
  CommandMetadata,
  CommandParamTypes,
  CommandParamMetadata,
  CommandOptionsOption,
  CommandPositionalOption,
  CommandParamMetadataItem,
} from './command.decorator';
import { CommandService } from './command.service';
import { prompt } from 'enquirer';
import { PromptOptions } from './enquirer';

@Injectable()
export class CommandExplorerService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly commandService: CommandService
  ) {}

  explore(): CommandModule[] {
    const components = [...this.modulesContainer.values()].map(
      (module) => module.components
    );

    return components
      .map((component) =>
        [...component.values()].map(({ instance }) =>
          this.filterCommands(instance)
        )
      )
      .flat(2)
      .filter(Boolean) as CommandModule[];
  }

  protected filterCommands(instance: IInjectable) {
    if (!instance) return;

    const prototype = Object.getPrototypeOf(instance);
    const components = this.metadataScanner.scanFromPrototype(
      instance,
      prototype,
      (name) => this.extractMetadata(prototype, name)
    );

    return components
      .filter((command) => !!command.metadata)
      .map<CommandModule>((command) => {
        const exec = (instance as any)[command.methodName].bind(instance);

        const builder: NonNullable<CommandModule['builder']> = (yargs) =>
          this.generateCommandBuilder(
            command.metadata.params as CommandParamMetadata<
              CommandOptionsOption | CommandPositionalOption
            >,
            yargs
          );

        const handler: NonNullable<CommandModule['handler']> = async (args) => {
          const [params, defaultParams] = this.generateCommandHandlerParams(
            command.metadata.params as CommandParamMetadata<
              CommandOptionsOption | CommandPositionalOption
            >,
            args
          );

          const promptList = this.generatePromptParams(
            command.metadata.params as CommandParamMetadata<PromptOptions>
          );

          let EffectivePromptListIndex: number[] = [],
            EffectivePromptList: PromptOptions[] = [];

          promptList.forEach((option, index) => {
            if (
              params[index] == undefined ||
              params[index] === defaultParams[index]
            ) {
              EffectivePromptList.push(option);
              EffectivePromptListIndex.push(index);
            }
          });

          const prompts = await prompt(EffectivePromptList);

          Object.values(prompts).forEach((prompt, index) => {
            params[EffectivePromptListIndex[index]] = prompt;
          });

          this.commandService.run();
          const code = await exec(...params);
          command.metadata.option.autoExit &&
            this.commandService.exit(code || 0);
        };

        return {
          ...command.metadata.option,
          builder,
          handler,
        };
      });
  }

  protected extractMetadata(
    prototype: { [x: string]: any },
    methodName: string
  ) {
    const callback = prototype[methodName];
    const metadata: CommandMetadata = Reflect.getMetadata(
      COMMAND_HANDLER_METADATA,
      callback
    );

    return {
      methodName,
      metadata,
    };
  }

  protected iteratorParamMetadata<O>(
    params: CommandParamMetadata<O>,
    callback: (item: CommandParamMetadataItem<O>, key: string) => void
  ) {
    if (!params) {
      return;
    }

    Object.keys(params).forEach((key) => {
      const param: CommandParamMetadataItem<O>[] =
        params[key as CommandParamTypes];
      if (!param || !Array.isArray(param)) {
        return;
      }

      param.forEach((metadata) => callback(metadata, key));
    });
  }

  private generateCommandHandlerParams(
    params: CommandParamMetadata<
      CommandOptionsOption | CommandPositionalOption
    >,
    argv: Arguments
  ) {
    const list: (Arguments | unknown)[] = [];
    const defaultValueList: any[] = [];

    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case CommandParamTypes.OPTION:
          list[item.index] = argv[(item.option as CommandOptionsOption).name];
          defaultValueList[item.index] = item.option.default;
          break;

        case CommandParamTypes.POSITIONAL:
          list[item.index] =
            argv[(item.option as CommandPositionalOption).name];
          defaultValueList[item.index] = item.option.default;
          break;

        case CommandParamTypes.ARGV:
          list[item.index] = argv;
          break;

        default:
          break;
      }
    });

    return [list, defaultValueList] as const;
  }

  private generateCommandBuilder(
    params: CommandParamMetadata<
      CommandOptionsOption | CommandPositionalOption
    >,
    yargs: Argv
  ) {
    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case CommandParamTypes.OPTION:
          yargs.option(
            (item.option as CommandOptionsOption).name,
            item.option as CommandOptionsOption
          );
          break;

        case CommandParamTypes.POSITIONAL:
          yargs.positional(
            (item.option as CommandPositionalOption).name,
            item.option as CommandPositionalOption
          );
          break;

        default:
          break;
      }
    });

    return yargs;
  }

  private generatePromptParams(params: CommandParamMetadata<PromptOptions>) {
    const list: PromptOptions[] = [];
    this.iteratorParamMetadata<PromptOptions>(params, (item, key) => {
      switch (key) {
        case CommandParamTypes.PROMPT:
          list[item.index] = item.option;
          break;

        default:
          break;
      }
    });

    return list;
  }
}
