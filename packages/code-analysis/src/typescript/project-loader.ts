import { Project } from 'ts-morph';

export function createTypeScriptProject(
  tsconfigPath: string
): Project {

  return new Project({
    tsConfigFilePath: tsconfigPath,
  });
}
