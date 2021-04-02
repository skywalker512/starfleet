import { SetMetadata } from '@nestjs/common';
import { Options, PositionalOptions } from 'yargs';
import type { PromptOptions } from './enquirer';

export const COMMAND_HANDLER_METADATA = Symbol('__command-handler-metadata__');
export const COMMAND_ARGS_METADATA = Symbol('__command-args-metadata__');
export enum CommandParamTypes {
  POSITIONAL = 'POSITIONAL',
  OPTION = 'OPTION',
  ARGV = 'ARGV',
  PROMPT = 'PROMPT',
}

export type CommandParamMetadata<O> = {
  [type in CommandParamTypes]: CommandParamMetadataItem<O>[];
};
export interface CommandParamMetadataItem<O> {
  index: number;
  option: O;
}
const createCommandParamDecorator = <O>(paramtype: CommandParamTypes) => {
  return (option?: O): ParameterDecorator => (target: any, key, index) => {
    const params =
      Reflect.getMetadata(COMMAND_ARGS_METADATA, target[key]) || {};
    Reflect.defineMetadata(
      COMMAND_ARGS_METADATA,
      {
        ...params,
        [paramtype]: [
          ...(params[paramtype] || []),
          { index, option } as CommandParamMetadataItem<O>,
        ],
      },
      target[key]
    );
  };
};

export interface CommandMetadata {
  params: CommandParamMetadata<
    CommandPositionalOption | CommandOptionsOption | PromptOptions
  >;
  option: CommandOption;
}
export interface CommandOption {
  aliases?: string[] | string;
  command: string[] | string;
  describe?: string | false;
  autoExit?: boolean;
}
export function Command(option: CommandOption): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    if (option && typeof option.autoExit !== 'boolean') {
      option.autoExit = true;
    }

    const metadata: CommandMetadata = {
      params: Reflect.getMetadata(COMMAND_ARGS_METADATA, descriptor.value),
      option,
    };

    SetMetadata(COMMAND_HANDLER_METADATA, metadata)(target, key, descriptor);
  };
}
export interface CommandPositionalOption extends PositionalOptions {
  name: string;
}

export const Positional = createCommandParamDecorator<CommandPositionalOption>(
  CommandParamTypes.POSITIONAL
);

export interface CommandOptionsOption extends Options {
  name: string;
}
export const Option = createCommandParamDecorator<CommandOptionsOption>(
  CommandParamTypes.OPTION
);

export const Argv = createCommandParamDecorator(CommandParamTypes.ARGV);

export const Prompt = createCommandParamDecorator<PromptOptions>(
  CommandParamTypes.PROMPT
);
