// packages\code-analysis\test\fixtures\ts-morph\create-project-fixture.ts
import { Project } from 'ts-morph';

export function createProject(): Project {
  return new Project({
    useInMemoryFileSystem: true,
  });
}
