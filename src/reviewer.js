/**
 * Performs a static analysis review on a parsed file metadata object.
 * Returns warnings and a codebase health score.
 * 
 * @param {Object} parsedData Result from parser.js
 * @returns {Object} Review report with warnings and score
 */
export function reviewFile(parsedData) {
  const warnings = [];
  const { rawLines, language, functions, classes } = parsedData;

  // Let's analyze functions
  for (const fn of functions) {
    // 1. Check documentation
    if (!hasDocComment(rawLines, fn.line, language)) {
      warnings.push({
        line: fn.line,
        type: 'documentation',
        severity: 'warning',
        message: `Function '${fn.name}' lacks documentation comment.`
      });
    }

    // 2. Check function length
    const length = estimateFunctionLength(rawLines, fn.line, language);
    if (length > 30) {
      warnings.push({
        line: fn.line,
        type: 'complexity',
        severity: 'warning',
        message: `Function '${fn.name}' is too long (${length} lines). Consider splitting it.`
      });
    }
  }

  // Analyze classes and class methods
  for (const cls of classes) {
    if (!hasDocComment(rawLines, cls.line, language)) {
      warnings.push({
        line: cls.line,
        type: 'documentation',
        severity: 'info',
        message: `Class '${cls.name}' lacks documentation comment.`
      });
    }

    for (const method of cls.methods) {
      if (!hasDocComment(rawLines, method.line, language)) {
        warnings.push({
          line: method.line,
          type: 'documentation',
          severity: 'warning',
          message: `Method '${method.name}' in class '${cls.name}' lacks documentation comment.`
        });
      }

      const length = estimateFunctionLength(rawLines, method.line, language);
      if (length > 30) {
        warnings.push({
          line: method.line,
          type: 'complexity',
          severity: 'warning',
          message: `Method '${method.name}' in class '${cls.name}' is too long (${length} lines).`
        });
      }
    }
  }

  // 3. Overall complexity: check for deeply nested loops/conditionals (e.g. 4+ indents or nested ifs)
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const lineNum = i + 1;
    const indentLevel = line.length - line.trimStart().length;

    // Warning for deeply nested lines (rough check: 12+ spaces of leading indent)
    if (indentLevel >= 12 && line.trim().length > 0) {
      // Avoid duplicate alerts for consecutive nested lines
      const prevLine = i > 0 ? rawLines[i - 1] : '';
      const prevIndent = prevLine.length - prevLine.trimStart().length;
      if (prevIndent < 12) {
        warnings.push({
          line: lineNum,
          type: 'nesting',
          severity: 'info',
          message: 'Deep nesting detected. Consider extracting inner logic into a helper.'
        });
      }
    }
  }

  // Calculate health score: start at 100, subtract 10 per warning, 5 per info, floor at 0
  let score = 100;
  for (const w of warnings) {
    if (w.severity === 'warning') {
      score -= 10;
    } else {
      score -= 5;
    }
  }
  score = Math.max(0, score);

  return {
    fileName: parsedData.fileName,
    language: parsedData.language,
    totalLines: rawLines.length,
    warningsCount: warnings.length,
    warnings,
    healthScore: score
  };
}

/**
 * Checks if the line before a symbol definition is a comment.
 */
function hasDocComment(lines, lineIndex, language) {
  // Translate 1-based line index to 0-based array index
  const idx = lineIndex - 1;

  // Scan up to 3 lines back
  for (let i = 1; i <= 3; i++) {
    const prevIdx = idx - i;
    if (prevIdx < 0) break;

    const line = lines[prevIdx].trim();
    if (line.length === 0) continue; // skip blank lines

    if (language === 'javascript') {
      if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.endsWith('*/')) {
        return true;
      }
    } else if (language === 'python') {
      if (line.startsWith('#') || line.startsWith('"""') || line.startsWith("'''") || line.endsWith('"""') || line.endsWith("'''")) {
        return true;
      }
    }
    // If we hit code instead of comment, doc comment is missing
    break;
  }
  return false;
}

/**
 * Estimates the length of a function starting at a given line.
 */
function estimateFunctionLength(lines, startLine, language) {
  const startIdx = startLine - 1;
  const startContent = lines[startIdx];

  if (language === 'javascript') {
    // Look for braces matching block
    let braceCount = 0;
    let started = false;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];

      // Simple character scan for braces (ignoring strings/comments for this basic prototype)
      for (let char of line) {
        if (char === '{') {
          braceCount++;
          started = true;
        } else if (char === '}') {
          braceCount--;
        }
      }

      if (started && braceCount <= 0) {
        return (i - startIdx) + 1;
      }
    }
  } else if (language === 'python') {
    // Look at Python indentation
    const baseIndent = startContent.length - startContent.trimStart().length;

    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().length === 0) continue; // skip empty lines

      const indent = line.length - line.trimStart().length;
      if (indent <= baseIndent) {
        // Line has same or less indent, function has ended
        return i - startIdx;
      }
    }
  }

  // Fallback to end of file
  return lines.length - startIdx;
}
