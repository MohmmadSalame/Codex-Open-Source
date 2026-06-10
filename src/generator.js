import path from 'path';

/**
 * Formats parsed file metadata into a clean Markdown documentation page.
 * 
 * @param {Object} parsedData 
 * @returns {string} Markdown documentation text
 */
export function generateDocs(parsedData) {
  const { fileName, language, classes, functions, imports } = parsedData;
  
  let md = `# API Documentation: ${fileName}\n\n`;
  md += `*Generated automatically by Codex Lite on ${new Date().toISOString().split('T')[0]}.*\n\n`;
  
  md += `## Metadata\n`;
  md += `- **Language**: ${language}\n`;
  md += `- **File**: \`${fileName}\`\n`;
  md += `- **Imports**: ${imports.length} detected\n\n`;

  if (classes.length > 0) {
    md += `## Classes\n\n`;
    for (const cls of classes) {
      md += `### Class: \`${cls.name}\` (Line ${cls.line})\n`;
      if (cls.methods.length === 0) {
        md += `*No methods detected.*\n\n`;
      } else {
        md += `\n| Method | Parameters | Line |\n`;
        md += `| :--- | :--- | :--- |\n`;
        for (const method of cls.methods) {
          const paramsStr = method.params.join(', ') || '*none*';
          md += `| \`${method.name}()\` | \`${paramsStr}\` | ${method.line} |\n`;
        }
        md += `\n`;
      }
    }
  }

  if (functions.length > 0) {
    md += `## Functions\n\n`;
    md += `| Function | Parameters | Line |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const fn of functions) {
      const paramsStr = fn.params.join(', ') || '*none*';
      md += `| \`${fn.name}()\` | \`${paramsStr}\` | ${fn.line} |\n`;
    }
    md += `\n`;
  }

  if (classes.length === 0 && functions.length === 0) {
    md += `## API Surface\n`;
    md += `*No public classes or functions detected in this file.*\n`;
  }

  return md;
}

/**
 * Scaffolds an ES Module test file targeting the parsed file's functions.
 * Uses Node.js standard built-in 'node:test' and 'node:assert'.
 * 
 * @param {Object} parsedData 
 * @returns {string} Test boilerplate code
 */
export function generateTestBoilerplate(parsedData) {
  const { fileName, functions, classes } = parsedData;
  const baseName = path.basename(fileName, path.extname(fileName));
  const importPath = `./${fileName}`;

  let code = `// Unit tests for ${fileName}\n`;
  code += `// Generated automatically by Codex Lite using Node.js built-in test runner\n\n`;
  code += `import test from 'node:test';\n`;
  code += `import assert from 'node:assert/strict';\n`;

  // Construct named imports
  const importsList = [];
  for (const fn of functions) {
    importsList.push(fn.name);
  }
  for (const cls of classes) {
    importsList.push(cls.name);
  }

  if (importsList.length > 0) {
    code += `import { ${importsList.join(', ')} } from '${importPath}';\n\n`;
  } else {
    code += `// No public symbols detected for importing. Add code imports below.\n\n`;
  }

  // Generate test suite for functions
  if (functions.length > 0) {
    code += `test('Functions API surface tests', async (t) => {\n`;
    for (const fn of functions) {
      code += `  await t.test('should verify function ${fn.name}() behavior', () => {\n`;
      code += `    // TODO: Define inputs and expected outputs\n`;
      code += `    // const result = ${fn.name}(${fn.params.map(() => 'undefined').join(', ')});\n`;
      code += `    // assert.equal(result, expected);\n`;
      code += `    assert.ok(true, '${fn.name} stub test');\n`;
      code += `  });\n\n`;
    }
    code += `});\n\n`;
  }

  // Generate test suite for classes
  if (classes.length > 0) {
    for (const cls of classes) {
      code += `test('Class ${cls.name} API tests', async (t) => {\n`;
      code += `  const instance = new ${cls.name}();\n\n`;
      for (const method of cls.methods) {
        code += `  await t.test('should verify method ${method.name}() behavior', () => {\n`;
        code += `    // TODO: Define method behavior\n`;
        code += `    // const result = instance.${method.name}(${method.params.map(() => 'undefined').join(', ')});\n`;
        code += `    assert.ok(true, '${cls.name}.${method.name} stub test');\n`;
        code += `  });\n\n`;
      }
      code += `});\n\n`;
    }
  }

  return code;
}
