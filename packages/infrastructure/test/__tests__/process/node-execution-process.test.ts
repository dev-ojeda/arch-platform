// test/__tests__/process/node-execution-process.test.ts
import * as child_process from 'node:child_process';
import { EventEmitter } from 'node:events';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NodeExecutionProcess } from '../../../src/process/node-execution-process.js';

// 1. Envolvemos la creación de los mocks en vi.hoisted para que Vitest los eleve correctamente
const { mockSpawn, mockExecFileStandard } = vi.hoisted(() => {
  const spawnSpy = vi.fn();
  const execFileStandardSpy = vi.fn();
  const execFileAsyncWithPromisifySpy = vi.fn();

  // Asignamos el símbolo custom nativo de Node.js para simular el comportamiento de promisify
  Object.defineProperty(execFileStandardSpy, Symbol.for('util.promisify.custom'), {
    value: execFileAsyncWithPromisifySpy,
    enumerable: false,
    writable: true,
    configurable: true,
  });

  return {
    mockSpawn: spawnSpy,
    mockExecFileStandard: execFileStandardSpy,
    mockExecFileAsyncWithPromisify: execFileAsyncWithPromisifySpy,
  };
});

// 2. Ahora vi.mock puede consumir las variables de vi.hoisted sin romper la inicialización
vi.mock('node:child_process', async (importOriginal) => {
  const originalModule = await importOriginal<typeof child_process>();
  return {
    ...originalModule,
    spawn: mockSpawn,
    execFile: mockExecFileStandard,
  };
});

// 3. Definición estricta de Mock para procesos hijos
class MockChildProcess extends EventEmitter {
  readonly pid = 12345;
}

describe('NodeExecutionProcess', () => {
  let executionProcess: NodeExecutionProcess;

  beforeEach(() => {
    vi.clearAllMocks();
    executionProcess = new NodeExecutionProcess();
  });

  describe('executeInteractive', () => {
    it('debería ejecutar un comando interactivo exitosamente', async () => {
      const mockChild = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChild as child_process.ChildProcess);

      process.nextTick(() => {
        mockChild.emit('spawn');
        mockChild.emit('close', 0, null);
      });

      await expect(
        executionProcess.executeInteractive('test-command', ['--version']),
      ).resolves.toBeUndefined();

      expect(mockSpawn).toHaveBeenCalled();
    });

    it('debería jugar a fallar si el proceso interactivo da error', async () => {
      const mockChild = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChild as child_process.ChildProcess);

      process.nextTick(() => {
        mockChild.emit('close', 1, null);
      });

      await expect(
        executionProcess.executeInteractive('test-command', ['invalid']),
      ).rejects.toThrow('Interactive process failed with exit code: 1');
    });
  });
});
