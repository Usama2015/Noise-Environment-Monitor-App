#!/usr/bin/env node
/**
 * Mobile App Setup Verification Script
 * Noise Environment Monitor - Phase 1
 *
 * This script verifies that the mobile app is correctly set up and ready for development/testing.
 *
 * Checks:
 * - Node.js version
 * - Dependencies installed
 * - TypeScript configuration
 * - Jest configuration
 * - Required files exist
 * - Permissions configured (Android/iOS)
 *
 * Usage:
 *   node verify-setup.js
 *   npm run verify  (if added to package.json)
 *
 * Author: Group 4 (GMU)
 * Date: 2025-10-15
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class SetupVerifier {
  constructor() {
    this.checksPass = 0;
    this.checksFail = 0;
    this.checksTotal = 0;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  check(name, testFn) {
    this.checksTotal++;
    process.stdout.write(`  [${this.checksTotal}] ${name}... `);

    try {
      const result = testFn();
      if (result) {
        console.log(`${colors.green}✅ PASS${colors.reset}`);
        this.checksPass++;
        return true;
      } else {
        console.log(`${colors.red}❌ FAIL${colors.reset}`);
        this.checksFail++;
        return false;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ERROR${colors.reset}`);
      console.log(`      ${colors.red}${error.message}${colors.reset}`);
      this.checksFail++;
      return false;
    }
  }

  printSummary() {
    this.log('\n' + '='.repeat(60), 'cyan');
    this.log('VERIFICATION SUMMARY', 'cyan');
    this.log('='.repeat(60), 'cyan');
    this.log(`Total checks: ${this.checksTotal}`);
    this.log(`Passed: ${this.checksPass} ✅`, 'green');
    this.log(`Failed: ${this.checksFail} ❌`, this.checksFail > 0 ? 'red' : 'green');
    this.log(`Success rate: ${((this.checksPass / this.checksTotal) * 100).toFixed(1)}%`);
    this.log('='.repeat(60), 'cyan');

    if (this.checksFail === 0) {
      this.log('\n🎉 ALL CHECKS PASSED! Mobile app setup is complete.', 'green');
      this.log('You can now run: npm run android (or npm run ios)', 'green');
      return 0;
    } else {
      this.log(`\n⚠️  ${this.checksFail} check(s) failed. Please review errors above.`, 'yellow');
      return 1;
    }
  }
}

function main() {
  const verifier = new SetupVerifier();

  verifier.log('\n' + '='.repeat(60), 'cyan');
  verifier.log('MOBILE APP SETUP VERIFICATION', 'cyan');
  verifier.log('Noise Environment Monitor - Phase 1', 'cyan');
  verifier.log('='.repeat(60), 'cyan');
  verifier.log('');

  // Section 1: Environment
  verifier.log('Section 1: Environment', 'blue');

  verifier.check('Node.js version >= 18.x', () => {
    const version = process.version;
    const major = parseInt(version.split('.')[0].substring(1));
    if (major >= 18) {
      console.log(`\n      Found: ${version}`);
      return true;
    }
    console.log(`\n      Found: ${version} (requires >= 18.x)`);
    return false;
  });

  verifier.check('npm is installed', () => {
    try {
      execSync('npm --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  });

  // Section 2: Dependencies
  verifier.log('\nSection 2: Dependencies', 'blue');

  verifier.check('node_modules directory exists', () => {
    return fs.existsSync('node_modules');
  });

  verifier.check('package.json exists', () => {
    return fs.existsSync('package.json');
  });

  verifier.check('React Native installed', () => {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.dependencies && packageJson.dependencies['react-native'];
    } catch {
      return false;
    }
  });

  verifier.check('TypeScript installed', () => {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies['typescript'];
    } catch {
      return false;
    }
  });

  verifier.check('Jest installed', () => {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies['jest'];
    } catch {
      return false;
    }
  });

  verifier.check('react-native-audio-record installed', () => {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.dependencies && packageJson.dependencies['react-native-audio-record'];
    } catch {
      return false;
    }
  });

  // Section 3: Configuration Files
  verifier.log('\nSection 3: Configuration Files', 'blue');

  verifier.check('tsconfig.json exists', () => {
    return fs.existsSync('tsconfig.json');
  });

  verifier.check('jest.config.js exists', () => {
    return fs.existsSync('jest.config.js');
  });

  verifier.check('.eslintrc.js exists', () => {
    return fs.existsSync('.eslintrc.js');
  });

  verifier.check('babel.config.js exists', () => {
    return fs.existsSync('babel.config.js');
  });

  // Section 4: Source Files
  verifier.log('\nSection 4: Source Files', 'blue');

  verifier.check('src/ directory exists', () => {
    return fs.existsSync('src');
  });

  verifier.check('src/types/index.ts exists', () => {
    return fs.existsSync('src/types/index.ts');
  });

  verifier.check('src/services/AudioService.ts exists', () => {
    return fs.existsSync('src/services/AudioService.ts');
  });

  verifier.check('src/utils/DecibelCalculator.ts exists', () => {
    return fs.existsSync('src/utils/DecibelCalculator.ts');
  });

  verifier.check('src/utils/MovingAverageFilter.ts exists', () => {
    return fs.existsSync('src/utils/MovingAverageFilter.ts');
  });

  // Section 5: Test Files
  verifier.log('\nSection 5: Test Files', 'blue');

  verifier.check('__tests__/ directory exists', () => {
    return fs.existsSync('__tests__');
  });

  verifier.check('__tests__/AudioService.test.ts exists', () => {
    return fs.existsSync('__tests__/AudioService.test.ts');
  });

  verifier.check('__integration__/ directory exists', () => {
    return fs.existsSync('__integration__');
  });

  verifier.check('e2e/ directory exists', () => {
    return fs.existsSync('e2e');
  });

  // Section 6: Android Configuration
  verifier.log('\nSection 6: Android Configuration', 'blue');

  verifier.check('android/ directory exists', () => {
    return fs.existsSync('android');
  });

  verifier.check('AndroidManifest.xml exists', () => {
    return fs.existsSync('android/app/src/main/AndroidManifest.xml');
  });

  verifier.check('RECORD_AUDIO permission configured', () => {
    try {
      const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
      return manifest.includes('android.permission.RECORD_AUDIO');
    } catch {
      return false;
    }
  });

  // Section 7: iOS Configuration
  verifier.log('\nSection 7: iOS Configuration', 'blue');

  verifier.check('ios/ directory exists', () => {
    return fs.existsSync('ios');
  });

  verifier.check('Info.plist exists', () => {
    return fs.existsSync('ios/NoiseMonitor/Info.plist');
  });

  verifier.check('NSMicrophoneUsageDescription configured', () => {
    try {
      const plist = fs.readFileSync('ios/NoiseMonitor/Info.plist', 'utf8');
      return plist.includes('NSMicrophoneUsageDescription');
    } catch {
      return false;
    }
  });

  // Section 8: TypeScript Compilation
  verifier.log('\nSection 8: TypeScript Compilation', 'blue');

  verifier.check('TypeScript compiles without errors', () => {
    try {
      execSync('npx tsc --noEmit', { stdio: 'ignore' });
      return true;
    } catch {
      console.log('\n      Run: npx tsc --noEmit (to see errors)');
      return false;
    }
  });

  // Section 9: Tests
  verifier.log('\nSection 9: Tests', 'blue');

  verifier.check('Jest tests can run', () => {
    try {
      // Just check if jest can be invoked, don't run tests
      execSync('npm test -- --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  });

  // Print summary
  return verifier.printSummary();
}

// Run verification
process.exit(main());
