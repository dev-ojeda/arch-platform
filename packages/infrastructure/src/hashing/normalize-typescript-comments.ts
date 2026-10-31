// 📦 Paquetes Core (Packages)/infrastructure/src/hashing/normalize-typescript-comments.ts

import { createScanner, LanguageVariant, ScriptTarget, SyntaxKind } from 'typescript';

const PRESERVED_COMMENT_PATTERNS = [
  /^\/\*\*/,
  /^\/\/\/\s*<reference\b/,
  /@ts-(?:ignore|expect-error|nocheck|check)\b/,
];

function mustPreserveComment(comment: string): boolean {
  return PRESERVED_COMMENT_PATTERNS.some((pattern) => pattern.test(comment));
}

export function normalizeTypeScriptComments(source: string): string {
  const scanner = createScanner(ScriptTarget.Latest, false, LanguageVariant.Standard, source);

  const replacements: Array<{
    start: number;
    end: number;
    text: string;
  }> = [];

  while (true) {
    const kind = scanner.scan();

    if (kind === SyntaxKind.EndOfFileToken) {
      break;
    }

    if (kind !== SyntaxKind.SingleLineCommentTrivia && kind !== SyntaxKind.MultiLineCommentTrivia) {
      continue;
    }

    const start = scanner.getTokenStart();
    const end = scanner.getTokenEnd();
    const comment = source.slice(start, end);

    if (mustPreserveComment(comment)) {
      continue;
    }

    let replacementEnd = end;
    let replacementText = ' ';

    if (source[replacementEnd] === '\r' && source[replacementEnd + 1] === '\n') {
      replacementEnd += 2;
      replacementText = '';
    } else if (source[replacementEnd] === '\n' || source[replacementEnd] === '\r') {
      replacementEnd += 1;
      replacementText = '';
    }

    // Si el comentario está al final del archivo, elimina también
    // el espacio o salto de línea que lo separa del código anterior.
    if (replacementEnd === source.length && replacementText === ' ') {
      const previousChar = source[start - 1];

      if (previousChar === '\n' || previousChar === '\r') {
        replacements.push({
          start: start - (previousChar === '\n' && source[start - 2] === '\r' ? 2 : 1),
          end: replacementEnd,
          text: '',
        });
        continue;
      }
    }

    replacements.push({
      start,
      end: replacementEnd,
      text: replacementText,
    });
  }

  let normalized = source;

  for (const replacement of replacements.reverse()) {
    normalized =
      normalized.slice(0, replacement.start) + replacement.text + normalized.slice(replacement.end);
  }

  return normalized;
}
