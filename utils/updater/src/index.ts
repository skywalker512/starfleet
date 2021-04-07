import path from 'path';
import { readWantedLockfile, Lockfile } from '@pnpm/lockfile-file';
import { ProjectManifest } from '@pnpm/types';
import isSubdir from 'is-subdir';
import normalizePath from 'normalize-path';
import exists from 'path-exists';
import writeJsonFile from 'write-json-file';
import type { CompilerOptions, ProjectReference } from 'typescript';

export default async (workspaceDir: string) => {
  const pkgsDir = path.join(workspaceDir, 'packages');
  const lockfile = await readWantedLockfile(workspaceDir, {
    ignoreIncompatible: false,
  });
  if (lockfile == null) {
    throw new Error('no lockfile found');
  }
  return {
    'package.json': (manifest: ProjectManifest, dir: string) => {
      if (!isSubdir(pkgsDir, dir)) return manifest;
      return updateManifest(workspaceDir, manifest, dir);
    },
    'tsconfig.json': updateTSConfig.bind(null, {
      lockfile,
      workspaceDir,
    }),
  };
};

async function updateTSConfig(
  context: {
    lockfile: Lockfile;
    workspaceDir: string;
  },
  tsConfig: { compilerOptions: CompilerOptions },
  dir: string,
  manifest: ProjectManifest
) {
  if (manifest.name === '@pnpm/tsconfig') return tsConfig;
  const relative = normalizePath(path.relative(context.workspaceDir, dir));
  const importer = context.lockfile.importers[relative];
  if (!importer) return tsConfig;
  const deps = {
    ...importer.dependencies,
    ...importer.devDependencies,
  };
  const references = [] as Array<{ path: string }>;
  for (const spec of Object.values(deps)) {
    if (!spec.startsWith('link:') || spec.length === 5) continue;
    const relativePath = spec.substr(5);
    if (!(await exists(path.join(dir, relativePath, 'tsconfig.json'))))
      continue;
    references.push({ path: relativePath });
  }
  await writeJsonFile(
    path.join(dir, 'tsconfig.lint.json'),
    {
      extends: './tsconfig.json',
      include: ['src/**/*.ts', 'test/**/*.ts'],
    },
    { indent: 2 }
  );
  return {
    ...tsConfig,
    references: references.sort((r1, r2) =>
      r1.path.localeCompare(r2.path)
    ) as ProjectReference[],
  };
}

async function updateManifest(
  workspaceDir: string,
  manifest: ProjectManifest,
  _: string
) {
  return {
    ...manifest,
  };
}
