export type ImplicitDependencyEntry<T = '*' | string[]> = {
  [key: string]: T | ImplicitJsonSubsetDependency<T>;
};

export interface ImplicitJsonSubsetDependency<T = '*' | string[]> {
  [key: string]: T | ImplicitJsonSubsetDependency<T>;
}

export interface SfAffectedConfig {
  /**
   * Default based branch used by affected commands.
   */
  defaultBase?: string;
}

/**
 * sf.json configuration
 */
export interface SfJsonConfiguration<T = '*' | string[]> {
  implicitDependencies?: ImplicitDependencyEntry<T>;
  npmScope: string;
  affected?: SfAffectedConfig;
  projects: {
    [projectName: string]: SfJsonProjectConfiguration;
  };
  workspaceLayout?: {
    libsDir: string;
    appsDir: string;
  };
  tasksRunnerOptions?: {
    [tasksRunnerName: string]: {
      runner: string;
      options?: any;
    };
  };
  plugins?: string[];
}

export interface SfJsonProjectConfiguration {
  implicitDependencies?: string[];
  tags?: string[];
}
