import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonValidatorScript = path.join(__dirname, 'pythonValidator.py');

const KNOWN_JS_GLOBALS = new Set([
  'console', 'parseInt', 'parseFloat', 'Math', 'String', 'Number', 'Boolean',
  'Array', 'Object', 'Function', 'Symbol', 'Date', 'RegExp', 'Map', 'Set',
  'WeakMap', 'WeakSet', 'Promise', 'JSON', 'isNaN', 'isFinite', 'encodeURI',
  'decodeURI', 'encodeURIComponent', 'decodeURIComponent', 'require', 'process',
  'Buffer', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'BigInt', 'Int8Array', 'Uint8Array', 'Int32Array', 'Float64Array', 'Infinity', 'NaN', 'undefined',
  'eval', 'isPrototypeOf', 'toString', 'valueOf', 'globalThis', 'global'
]);

export function validateCode(language, code) {
  const lang = (language || '').toString().toLowerCase().trim();

  // 1. JAVASCRIPT VALIDATION
  if (lang === 'javascript' || lang === 'js' || lang === 'node') {
    try {
      const ast = acorn.parse(code, { ecmaVersion: 'latest', locations: true });
      const declared = new Set();
      const errors = [];

      // Pass 1: Collect all declared identifiers and assignments
      walk.simple(ast, {
        VariableDeclaration(node) {
          for (const decl of node.declarations) {
            if (decl.id.type === 'Identifier') declared.add(decl.id.name);
            else if (decl.id.type === 'ObjectPattern') {
              for (const prop of decl.id.properties) {
                if (prop.value && prop.value.type === 'Identifier') declared.add(prop.value.name);
                else if (prop.key && prop.key.type === 'Identifier') declared.add(prop.key.name);
              }
            } else if (decl.id.type === 'ArrayPattern') {
              for (const el of decl.id.elements) {
                if (el && el.type === 'Identifier') declared.add(el.name);
              }
            }
          }
        },
        FunctionDeclaration(node) {
          if (node.id && node.id.type === 'Identifier') declared.add(node.id.name);
          for (const param of node.params) {
            if (param.type === 'Identifier') declared.add(param.name);
          }
        },
        FunctionExpression(node) {
          if (node.id && node.id.type === 'Identifier') declared.add(node.id.name);
          for (const param of node.params) {
            if (param.type === 'Identifier') declared.add(param.name);
          }
        },
        ArrowFunctionExpression(node) {
          for (const param of node.params) {
            if (param.type === 'Identifier') declared.add(param.name);
          }
        },
        ClassDeclaration(node) {
          if (node.id && node.id.type === 'Identifier') declared.add(node.id.name);
        },
        AssignmentExpression(node) {
          if (node.left.type === 'Identifier') declared.add(node.left.name);
        }
      });

      // Pass 2: Check function call expressions across all branches (including else, switch, try, etc.)
      walk.simple(ast, {
        CallExpression(node) {
          if (node.callee.type === 'Identifier') {
            const fnName = node.callee.name;
            if (!declared.has(fnName) && !KNOWN_JS_GLOBALS.has(fnName)) {
              const line = node.loc.start.line;
              const col = node.loc.start.column + 1;
              let tip = "";
              if (fnName === 'print') {
                tip = "\nIn JavaScript, 'print()' does not exist. Use console.log() instead.";
              } else if (fnName === 'input') {
                tip = "\nIn Node.js, 'input()' is not defined. Read standard input or declare input.";
              }
              errors.push({
                line,
                col,
                message: `Line ${line}, col ${col}: ReferenceError: '${fnName}' is not defined.${tip}`
              });
            }
          }
        }
      });

      if (errors.length > 0) {
        return {
          valid: false,
          error: errors[0].message,
          line: errors[0].line
        };
      }

      return { valid: true };
    } catch (err) {
      const line = err.loc ? err.loc.line : 1;
      const col = err.loc ? err.loc.column + 1 : 1;
      return {
        valid: false,
        error: `Line ${line}, col ${col}: SyntaxError: ${err.message.replace(/\s*\(\d+:\d+\)$/, '')}`,
        line
      };
    }
  }

  // 2. PYTHON VALIDATION
  if (lang === 'python' || lang === 'py' || lang === 'python3') {
    try {
      const tmpPath = path.join(__dirname, `_temp_${Date.now()}_check.py`);
      fs.writeFileSync(tmpPath, code, 'utf-8');
      const res = spawnSync('python', [pythonValidatorScript, tmpPath], { encoding: 'utf-8', timeout: 3000 });
      try { fs.unlinkSync(tmpPath); } catch (e) {}

      if (res.status !== 0 && res.stderr) {
        return {
          valid: false,
          error: res.stderr.trim()
        };
      }
      return { valid: true };
    } catch (err) {
      // If local python fails or is absent, continue to Judge0
      return { valid: true };
    }
  }

  // C, C++, and Java are statically checked by Judge0's GCC/javac compiler automatically
  return { valid: true };
}
