import fs from 'fs';
import path from 'path';

/**
 * Parses a target file and extracts class, function, and import signatures.
 * Supports JavaScript/TypeScript and Python.
 * 
 * @param {string} filePath 
 * @returns {Object} Parse metadata object
 */
export function parseFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === '.py') {
    return parsePython(absolutePath, lines);
  } else if (ext === '.js' || ext === '.ts' || ext === '.mjs' || ext === '.cjs') {
    return parseJavaScript(absolutePath, lines);
  } else {
    return {
      filePath: absolutePath,
      fileName: path.basename(absolutePath),
      language: 'unknown',
      imports: [],
      classes: [],
      functions: [],
      rawLines: lines
    };
  }
}

/**
 * Parses JavaScript/TypeScript code using regex patterns.
 */
function parseJavaScript(filePath, lines) {
  const imports = [];
  const classes = [];
  const functions = [];
  const fileName = path.basename(filePath);

  let currentClass = null;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim();

    // Skip empty lines or full comment lines
    if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }

    // 1. Detect Imports
    if (line.startsWith('import ') || line.includes('require(')) {
      imports.push({ line: lineNum, text: line });
      continue;
    }

    // 2. Detect Classes
    const classMatch = line.match(/(?:export\s+default\s+|export\s+)?class\s+([A-Za-z0-9_$]+)(?:\s+extends\s+[A-Za-z0-9_$]+)?/);
    if (classMatch) {
      currentClass = {
        name: classMatch[1],
        line: lineNum,
        methods: []
      };
      classes.push(currentClass);
      continue;
    }

    // 3. Detect Methods within a class (simple indentation / state guess)
    // If we are currently inside a class, check for method-like structures
    if (currentClass) {
      // Check if class ends (rough block check, e.g. class closing brace at start of line)
      if (lines[i].startsWith('}') && !lines[i].includes('{')) {
        currentClass = null;
        continue;
      }

      const methodMatch = line.match(/^(?:async\s+)?([A-Za-z0-9_$]+)\s*\(([^)]*)\)\s*\{/);
      if (methodMatch) {
        const name = methodMatch[1];
        if (name !== 'if' && name !== 'for' && name !== 'while' && name !== 'switch' && name !== 'catch') {
          const params = methodMatch[2].split(',').map(p => p.trim()).filter(Boolean);
          currentClass.methods.push({ name, params, line: lineNum });
          continue;
        }
      }
    }

    // 4. Detect Top-Level Functions (when not inside a class)
    if (!currentClass) {
      const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)/);
      const arrowMatch = line.match(/(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);

      if (funcMatch) {
        functions.push({
          name: funcMatch[1],
          params: funcMatch[2].split(',').map(p => p.trim()).filter(Boolean),
          line: lineNum
        });
      } else if (arrowMatch) {
        functions.push({
          name: arrowMatch[1],
          params: arrowMatch[2].split(',').map(p => p.trim()).filter(Boolean),
          line: lineNum
        });
      }
    }
  }

  return {
    filePath,
    fileName,
    language: 'javascript',
    imports,
    classes,
    functions,
    rawLines: lines
  };
}

/**
 * Parses Python code using regex patterns.
 */
function parsePython(filePath, lines) {
  const imports = [];
  const classes = [];
  const functions = [];
  const fileName = path.basename(filePath);

  let currentClass = null;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim();

    // Skip empty or comment lines
    if (!line || line.startsWith('#')) {
      continue;
    }

    // 1. Detect Imports
    if (line.startsWith('import ') || line.startsWith('from ')) {
      imports.push({ line: lineNum, text: line });
      continue;
    }

    // 2. Detect Classes
    const classMatch = line.match(/^class\s+([A-Za-z0-9_$]+)(?:\(([^)]*)\))?:/);
    if (classMatch) {
      currentClass = {
        name: classMatch[1],
        line: lineNum,
        methods: []
      };
      classes.push(currentClass);
      continue;
    }

    // 3. Detect Functions/Methods
    const defMatch = line.match(/^def\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\):/);
    if (defMatch) {
      const name = defMatch[1];
      const params = defMatch[2].split(',').map(p => p.trim()).filter(Boolean);

      // Check indentation to determine if it's a class method or top-level function
      const originalLine = lines[i];
      const indentation = originalLine.length - originalLine.trimStart().length;

      if (currentClass && indentation > 0) {
        currentClass.methods.push({ name, params, line: lineNum });
      } else {
        // We've moved out of the class indentation block
        currentClass = null;
        functions.push({ name, params, line: lineNum });
      }
    }
  }

  return {
    filePath,
    fileName,
    language: 'python',
    imports,
    classes,
    functions,
    rawLines: lines
  };
}
