// packages/tooling/src/utils/format-command.ts

function quoteArgument(argument: string): string {
  if (argument.includes(' ')) {
    return `"${argument}"`;
  }

  return argument;
}

export function formatCommand(
  command: string,

  args: readonly string[] = [],
): string {
  return [command, ...args.map(quoteArgument)].join(' ');
}
