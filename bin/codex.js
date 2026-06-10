#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parseFile } from '../src/parser.js';
import { reviewFile } from '../src/reviewer.js';
import { generateDocs, generateTestBoilerplate } from '../src/generator.js';
import { generateDocWithAI, generateTestsWithAI, reviewCodeWithAI } from '../src/llm.js';

// Define CLI ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}Codex Lite CLI${colors.reset} - ${colors.gray}Zero-Dependency Developer Companion Prototype${colors.reset}

${colors.bold}Usage:${colors.reset}
  node bin/codex.js <command> <file-path> [options]

${colors.bold}Commands:${colors.reset}
  ${colors.green}doc${colors.reset} <file>      Generate markdown documentation for a code file
  ${colors.green}test${colors.reset} <file>     Scaffold a boilerplate unit test file
  ${colors.green}review${colors.reset} <file>   Perform a structure and quality review of the file

${colors.bold}Options:${colors.reset}
  ${colors.yellow}--ai${colors.reset}            Enable AI-Assisted mode using OpenAI API (requires OPENAI_API_KEY)
  ${colors.yellow}-h, --help${colors.reset}    Show this help menu
  `);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];
  const fileArg = args[1];

  if (!fileArg || fileArg.startsWith('-')) {
    console.error(`${colors.red}Error: Missing file argument.${colors.reset}`);
    printHelp();
    process.exit(1);
  }

  const isAI = args.includes('--ai');
  const targetPath = path.resolve(fileArg);

  if (!fs.existsSync(targetPath)) {
    console.error(`${colors.red}Error: File not found at path "${fileArg}"${colors.reset}`);
    process.exit(1);
  }

  try {
    // 1. Run local parser
    const parsedData = parseFile(targetPath);

    switch (command) {
      case 'doc':
        await handleDoc(parsedData, targetPath, isAI);
        break;
      case 'test':
        await handleTest(parsedData, targetPath, isAI);
        break;
      case 'review':
        await handleReview(parsedData, targetPath, isAI);
        break;
      default:
        console.error(`${colors.red}Error: Unknown command "${command}".${colors.reset}`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}Command Failed:${colors.reset} ${error.message}\n`);
    process.exit(1);
  }
}

async function handleDoc(parsedData, targetPath, isAI) {
  const dirName = path.dirname(targetPath);
  const extName = path.extname(targetPath);
  const baseName = path.basename(targetPath, extName);
  const docPath = path.join(dirName, `${baseName}_doc.md`);

  console.log(`${colors.blue}Generating documentation for ${colors.bold}${parsedData.fileName}${colors.reset}...`);
  
  let docContent = '';
  if (isAI) {
    console.log(`${colors.yellow}Running in AI-Assisted Mode using OpenAI...${colors.reset}`);
    const fileContent = fs.readFileSync(targetPath, 'utf8');
    docContent = await generateDocWithAI(parsedData.fileName, fileContent);
  } else {
    console.log(`${colors.gray}Running in Local Rule-Based Mode...${colors.reset}`);
    docContent = generateDocs(parsedData);
  }

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log(`${colors.green}✓ Documentation successfully created at:${colors.reset} ${colors.bold}${docPath}${colors.reset}\n`);
}

async function handleTest(parsedData, targetPath, isAI) {
  const dirName = path.dirname(targetPath);
  const extName = path.extname(targetPath);
  const baseName = path.basename(targetPath, extName);
  
  // Choose extension based on parser language
  const testExt = parsedData.language === 'python' ? '_test.py' : '.test.js';
  const testPath = path.join(dirName, `${baseName}${testExt}`);

  console.log(`${colors.blue}Scaffolding test file for ${colors.bold}${parsedData.fileName}${colors.reset}...`);

  let testContent = '';
  if (isAI) {
    console.log(`${colors.yellow}Running in AI-Assisted Mode using OpenAI...${colors.reset}`);
    const fileContent = fs.readFileSync(targetPath, 'utf8');
    testContent = await generateTestsWithAI(parsedData.fileName, fileContent);
  } else {
    console.log(`${colors.gray}Running in Local Rule-Based Mode...${colors.reset}`);
    testContent = generateTestBoilerplate(parsedData);
  }

  fs.writeFileSync(testPath, testContent, 'utf8');
  console.log(`${colors.green}✓ Test boilerplate successfully created at:${colors.reset} ${colors.bold}${testPath}${colors.reset}\n`);
}

async function handleReview(parsedData, targetPath, isAI) {
  console.log(`${colors.blue}Reviewing file ${colors.bold}${parsedData.fileName}${colors.reset}...`);

  if (isAI) {
    console.log(`${colors.yellow}Running in AI-Assisted Mode using OpenAI...${colors.reset}`);
    const fileContent = fs.readFileSync(targetPath, 'utf8');
    const aiReview = await reviewCodeWithAI(parsedData.fileName, fileContent);
    console.log(`\n${colors.bold}=== AI Code Review Report ===${colors.reset}`);
    console.log(aiReview);
    console.log(`\n${colors.green}✓ AI Review Completed.${colors.reset}\n`);
  } else {
    console.log(`${colors.gray}Running in Local Rule-Based Mode...${colors.reset}`);
    const report = reviewFile(parsedData);

    console.log(`\n${colors.bold}=== Code Review Report: ${colors.cyan}${report.fileName}${colors.reset} ===`);
    console.log(`${colors.gray}Language:${colors.reset} ${report.language.toUpperCase()}`);
    console.log(`${colors.gray}Total Lines:${colors.reset} ${report.totalLines}`);
    console.log(`${colors.gray}Warnings:${colors.reset} ${report.warningsCount}`);

    // Print health score with coloring
    let scoreColor = colors.green;
    if (report.healthScore < 50) scoreColor = colors.red;
    else if (report.healthScore < 80) scoreColor = colors.yellow;

    console.log(`${colors.gray}Code Health Score:${colors.reset} ${scoreColor}${colors.bold}${report.healthScore}/100${colors.reset}`);
    console.log(`${colors.gray}------------------------------------------------${colors.reset}`);

    if (report.warnings.length === 0) {
      console.log(`${colors.green}✓ No warnings detected! Code looks clean.${colors.reset}`);
    } else {
      report.warnings.forEach(w => {
        const typeStr = `[${w.type.toUpperCase()}]`;
        const lineStr = `Line ${w.line}:`;
        const color = w.severity === 'warning' ? colors.yellow : colors.blue;
        console.log(` ${color}${typeStr}${colors.reset} ${colors.bold}${lineStr}${colors.reset} ${w.message}`);
      });
    }
    console.log('');
  }
}

main();
