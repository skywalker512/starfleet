import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class DynamicImportModule {
  public static async registerPluginsAsync(): Promise<DynamicModule> {
    return this.loadPlugins();
  }
  public static pluginsArray: any[] = [];

  private static loadPlugins() {
    const loadedPlugins: Array<Promise<DynamicModule>> = [];
    ['@starfleet/cli-new'].forEach(filePath => {
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
    let plugin;
    try {
      plugin = require(pluginPath);
    } catch (e) {
      plugin = undefined;
    }
    return plugin;
  }
}
