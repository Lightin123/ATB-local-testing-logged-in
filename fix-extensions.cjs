#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const srcDir = path.join(projectRoot, 'src');
const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '.cache']);

const renameOps = [];

function hasJSX(content) {
  const openTag = /<([A-Za-z][\w-]*)(\s[^]*?)?>/;
  const closeOrSelf = /<\//.test(content) || /\/>/.test(content);
  return openTag.test(content) && closeOrSelf;
}

function walkCollect(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walkCollect(fullPath);
      }
      continue;
    }
    const ext = path.extname(entry.name);
    if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) continue;
    const base = entry.name.slice(0, -ext.length);
    const content = fs.readFileSync(fullPath, 'utf8');
    const usesJSX = hasJSX(content);
    let newExt;
    if ((ext === '.js' || ext === '.ts') && usesJSX) {
      newExt = ext + 'x';
    } else if (ext === '.jsx' && !usesJSX) {
      newExt = '.js';
    } else if (ext === '.tsx' && !usesJSX) {
      newExt = '.ts';
    }
    if (newExt) {
      const newPath = path.join(dir, base + newExt);
      renameOps.push({ old: fullPath, new: newPath });
    }
  }
}

function walkUpdate(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walkUpdate(fullPath);
      }
      continue;
    }
    const ext = path.extname(entry.name);
    if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      updateImports(fullPath);
    }
  }
}

function updateImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  let changed = false;
  const regex = /\bfrom\s+['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/g;

  content = content.replace(regex, (full, fromPath, requirePath, importPath) => {
    const importFile = fromPath || requirePath || importPath;
    if (!importFile.startsWith('.') && !importFile.startsWith('/')) return full;
    const abs = path.resolve(dir, importFile);
    const newAbs = renameMap.get(abs);
    if (!newAbs) return full;
    let rel = path.relative(dir, newAbs);
    if (!rel.startsWith('.')) rel = './' + rel;
    rel = rel.split(path.sep).join('/');
    changed = true;
    console.log(`Updated import in ${path.relative(srcDir, file)}: ${importFile} -> ${rel}`);
    return full.replace(importFile, rel);
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

// collect files to rename
walkCollect(srcDir);

// rename to temporary names to avoid collisions
for (const op of renameOps) {
  const temp = op.old + '.tmp_swap';
  fs.renameSync(op.old, temp);
  op.temp = temp;
}

// final rename and log
for (const op of renameOps) {
  fs.renameSync(op.temp, op.new);
  console.log(`Renamed: ${path.relative(srcDir, op.old)} -> ${path.relative(srcDir, op.new)}`);
}

const renameMap = new Map(renameOps.map(op => [path.resolve(op.old), path.resolve(op.new)]));

// update imports
walkUpdate(srcDir);