import { DynamicModule, Module } from '@nestjs/common';
import importCwd from 'import-cwd';
import glob from 'tiny-glob';

@Module({})
export class DynamicImportModule {
  public static async registerPluginsAsync(): Promise<DynamicModule> {
    return await this.loadPlugins();
  }
  public static pluginsArray: any[] = [];

  private static async loadPlugins() {
    const loadedPlugins: Array<Promise<DynamicModule>> = [];
    let files = await glob('node_modules/@starfleet/cli-!(common)');
    files = files.map(file => file.replace('node_modules/', ''))

    files.forEach(filePath => {
      loadedPlugins.push(
        this.loadPlugin(filePath)
      );
    });

    return Promise.all(loadedPlugins).then((allPlugins) => {
      allPlugins.filter(Boolean).forEach((module: any) => {
        const foundModuleEntryName = Object.keys(module).find(key => key.indexOf('Module'));
        if (foundModuleEntryName) {
          this.pluginsArray.push({ name: foundModuleEntryName, module: module[foundModuleEntryName] });
        }
      });
      return {
        module: DynamicImportModule,
        imports: [...this.pluginsArray.map(plugin => plugin.module)]
      } as DynamicModule;
    });
  }

  private static async loadPlugin(pluginPath: string): Promise<DynamicModule> {
    return importCwd.silent(pluginPath) as DynamicModule;
  }
}
