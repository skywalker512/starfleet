import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WORKSPACE_CONFIG, WORKSPACE_MODULE_OPTIONS } from './workspace.constants';
import fs from 'fs';
import path from 'path';


@Global()
@Module({})
export class WorkspaceModule {
  public static forRoot(): DynamicModule {
    return {
      exports: [WorkspaceService, WORKSPACE_CONFIG, WORKSPACE_MODULE_OPTIONS],
      module: WorkspaceModule,
      providers: this.createProviders()
    };
  }

  private static createProviders(): Provider[] {
    return [
      {
        provide: WORKSPACE_MODULE_OPTIONS,
        useValue: {
          root: process.cwd()
        }
      },
      {
        provide: WORKSPACE_CONFIG,
        useFactory: (config: any) =>
          JSON.parse(
            fs
              .readFileSync(path.join(config.root, 'workspace.json'))
              .toString()
          ),
        inject: [
          WORKSPACE_MODULE_OPTIONS
        ]
      },
      {
        provide: WorkspaceService,
        useClass: WorkspaceService,
      }
    ];
  }
}
