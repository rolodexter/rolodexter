import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import glob from 'glob';

// Get directory paths
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const PIPELINE_ROOT = path.join(PROJECT_ROOT, 'pipeline');

// Default values
const DEFAULT_MODEL = 'meta-llama/Meta-Llama-3-70B-Instruct';
const TOGETHER_CLI = 'together';
let TEST_MODE = false;

// Colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const NC = '\x1b[0m';

function errorExit(message) {
  console.error(`${RED}Error: ${message}${NC}`);
  process.exit(1);
}

function info(message) {
  console.log(`${GREEN}Info: ${message}${NC}`);
}

function testInfo(message) {
  if (TEST_MODE) {
    console.log(`${CYAN}Test: ${message}${NC}`);
  }
}

function warn(message) {
  console.warn(`${YELLOW}Warning: ${message}${NC}`);
}

function prompt(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${BLUE}${message}${NC}`, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function checkRequirements() {
  // Check Together CLI
  try {
    await execAsync(`command -v ${TOGETHER_CLI}`);
    info('Together CLI found');
  } catch (error) {
    errorExit('Together CLI not installed. Run: pip install together');
  }

  // Check API key
  if (!process.env.TOGETHER_API_KEY) {
    errorExit('TOGETHER_API_KEY not set. Please run: export TOGETHER_API_KEY="your-api-key"');
  }
  info('API key found');

  // Check pipeline directory exists
  if (!fs.existsSync(PIPELINE_ROOT)) {
    errorExit(`Pipeline directory not found at: ${PIPELINE_ROOT}`);
  }
  info('Pipeline directory found');
}

async function selectFinetuningFile() {
  const fileList = await new Promise((resolve, reject) => {
    glob(`${PIPELINE_ROOT}/**/finetuning.jsonl`, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });

  if (fileList.length === 0) {
    errorExit('No finetuning.jsonl files found in the pipeline directory');
  }

  console.log('\nAvailable finetuning files:');
  fileList.forEach((file, index) => {
    console.log(`${YELLOW}${index + 1}${NC}) ${file}`);
  });

  while (true) {
    const selection = await prompt('Enter the number of the finetuning file you want to use: ');
    if (/^\d+$/.test(selection) && selection >= 1 && selection <= fileList.length) {
      return fileList[selection - 1];
    }
    warn('Invalid selection. Please enter a number from the list.');
  }
}

async function checkFileFormat(filepath) {
  if (TEST_MODE) {
    testInfo(`Would check file format: ${filepath}`);
    return;
  }

  info('Checking file format...');
  try {
    const checkOutput = await execAsync(`${TOGETHER_CLI} files check "${filepath}"`);
    if (!checkOutput.includes('"is_check_passed": true')) {
      errorExit('File format check failed. Please ensure it\'s a valid JSONL file');
    }
    info('File format validation passed');
  } catch (error) {
    errorExit(`Error checking file format: ${error.message}`);
  }
}

async function uploadFile(filepath) {
  if (TEST_MODE) {
    testInfo(`Would upload: ${filepath}`);
    return 'file-test-12345';
  }

  info('Uploading file...');
  try {
    const response = await execAsync(`${TOGETHER_CLI} files upload "${filepath}"`);
    const fileId = response.match(/"id": "([^"]*)"/)[1];
    if (!fileId) {
      errorExit('Failed to get file ID from upload');
    }
    info(`File uploaded with ID: ${fileId}`);
    return fileId;
  } catch (error) {
    errorExit(`Error uploading file: ${error.message}`);
  }
}

async function startFinetuning(fileId, modelName) {
  if (TEST_MODE) {
    testInfo('Would start fine-tuning:');
    testInfo(`File ID: ${fileId}`);
    testInfo(`Model: ${modelName}`);
    testInfo('Using LoRA fine-tuning');
    return 'ft-test-67890';
  }

  info('Starting fine-tuning...');
  try {
    const response = await execAsync(`${TOGETHER_CLI} fine-tuning create --training-file "${fileId}" --model "${modelName}" --lora --confirm`);
    const jobId = response.match(/ft-[a-zA-Z0-9-]*/)[0];
    if (!jobId) {
      errorExit('Failed to get job ID');
    }
    info(`Job started with ID: ${jobId}`);
    return jobId;
  } catch (error) {
    errorExit(`Error starting fine-tuning: ${error.message}`);
  }
}

async function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  if (args.includes('--test')) {
    TEST_MODE = true;
  }
  const modelName = args.find((arg) => !arg.startsWith('--')) || DEFAULT_MODEL;

  // Main execution
  if (TEST_MODE) {
    console.log(`\n${CYAN}=== Together AI Fine-tuning (TEST MODE) ===${NC}`);
    testInfo('Model recommendations:');
    testInfo('- Llama 3 8B Instruct (meta-llama/Meta-Llama-3-8B) for simpler datasets');
    testInfo('- Llama 3 70B Instruct (meta-llama/Meta-Llama-3-70B-Instruct) for complex datasets');
  } else {
    console.log(`\n${GREEN}=== Together AI Fine-tuning ===${NC}`);
  }

  info(`Using model: ${modelName}`);

  await checkRequirements();

  const filepath = await selectFinetuningFile();
  await checkFileFormat(filepath);
  const fileId = await uploadFile(filepath);
  const jobId = await startFinetuning(fileId, modelName);

  // Final output
  if (TEST_MODE) {
    console.log(`\n${CYAN}Test completed successfully! Here's what would happen:${NC}`);
  } else {
    console.log(`\n${GREEN}Fine-tuning process initiated successfully!${NC}`);
  }

  console.log(`Selected file: ${YELLOW}${filepath}${NC}`);
  console.log(`File ID: ${YELLOW}${fileId}${NC}`);
  console.log(`Job ID: ${YELLOW}${jobId}${NC}`);

  if (TEST_MODE) {
    console.log(`\n${CYAN}To run for real, remove the --test flag${NC}`);
  } else {
    console.log('\nMonitor your job with:');
    console.log(`${YELLOW}together fine-tuning retrieve ${jobId}${NC}`);
    console.log('\nOr visit: https://api.together.xyz/jobs');
  }
}

main().catch((error) => {
  console.error(`${RED}Unexpected error: ${error.message}${NC}`);
  process.exit(1);
});