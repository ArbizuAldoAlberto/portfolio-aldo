const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', '.github', 'scripts'];
const EXTENSIONS_TO_CHECK = ['.ts', '.tsx', '.js', '.jsx', '.json', '.html'];

// Regex patterns for potential leaked secrets
const PATTERNS = [
  { name: 'Resend API Key', regex: /re_[a-zA-Z0-9]{24}/g },
  { name: 'Stripe Secret Key', regex: /sk_live_[a-zA-Z0-9]{24,}/g },
  { name: 'Stripe Test Key', regex: /sk_test_[a-zA-Z0-9]{24,}/g },
  { name: 'Generic Password/Key Assignment', regex: /(password|api_key|secret|private_key)\s*=\s*['"`][a-zA-Z0-9_\-]{16,}['"`]/gi }
];

let leaksFound = 0;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(PROJECT_ROOT, filePath);

  PATTERNS.forEach(pattern => {
    // If it's a test mock placeholder, ignore it
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      const matchText = match[0];
      if (
        matchText.includes('placeholder') || 
        matchText.includes('re_placeholder') || 
        matchText.includes('sk_placeholder') ||
        matchText.includes('example')
      ) {
        continue;
      }
      console.error(`❌ FAILED: ${pattern.name} found in ${relativePath}:${match.index}`);
      console.error(`   Leak snippet: "... ${content.substring(Math.max(0, match.index - 10), Math.min(content.length, match.index + matchText.length + 10))} ..."`);
      leaksFound++;
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        walkDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (EXTENSIONS_TO_CHECK.includes(ext)) {
        scanFile(fullPath);
      }
    }
  });
}

console.log("=============================================================");
console.log("🛡️  NEXUS Security Audit Gate: scan_security_gate.js starting");
console.log("=============================================================");

// 1. Audit .gitignore rules
const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log("✅ PASS: .gitignore file rules verified -- [EXCLUDES .env*]");
  } else {
    console.warn("⚠️  WARN: .gitignore doesn't seem to explicitly exclude '.env' files.");
  }
} else {
  console.warn("⚠️  WARN: .gitignore file not found in root.");
}

// 2. Scan project files recursively for keys
console.log("Scanning source files for hardcoded secrets...");
walkDir(PROJECT_ROOT);

console.log("=============================================================");
if (leaksFound > 0) {
  console.error(`❌ SECURITY GATE FAILED: Found ${leaksFound} potential leaks!`);
  console.error("Please remove hardcoded credentials and use process.env instead.");
  console.log("=============================================================");
  process.exit(1);
} else {
  console.log("✅ SECURITY GATE PASSED: 0 vulnerabilities or secrets found.");
  console.log("=============================================================");
  process.exit(0);
}
