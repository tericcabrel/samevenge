#!/usr/bin/env zx

import fs from 'fs/promises';
import { $ } from 'zx';

// AWS services that support SAM local generate-event; to see them, run: sam local generate-event --help
// The commented services are not recognized by SAM local generate-event
const AWS_SERVICES = [
  'alexa-skills-kit',
  // 'alexa-smarthome',
  'apigateway',
  'appsync',
  // 'autoscaling',
  'cloudformation',
  'cloudfront',
  'cloudwatch',
  'codecommit',
  'codepipeline',
  'cognito',
  'config',
  'connect',
  'dynamodb',
  //'ec2',
  //'elasticache',
  //'elasticsearch',
  //'elb',
  //'events',
  //'iot',
  'kinesis',
  'lex',
  'rekognition',
  's3',
  'ses',
  'sns',
  'sqs',
  'stepfunctions',
];

const SERVICES_FILE = './public/data/services.json';
const COMMAND_NAME_REGEX = /^(\w+(-\w+)*)/;

async function generateServiceTemplates(service) {
  try {
    console.info(`\nGenerating templates for service: ${service}`);

    const { stdout: output } = await $`sam local generate-event ${service} --help`;

    // Look for lines after "Commands:" that contain command names
    const lines = output.split('\n');
    const commandsIndex = lines.findIndex((line) => line.trim() === 'Commands:');

    if (commandsIndex !== -1) {
      // Extract all lines after "Commands:" that look like commands
      const commandLines = lines.slice(commandsIndex + 1);

      const events = commandLines
        .map((line) => line.replaceAll(/^ {2}/gm, '')) // Remove two first leading spaces on the line
        .filter((line) => line && !line.startsWith('-') && !line.startsWith('Options:'))
        .map((line, index) => {
          if (line.charAt(0) === ' ') {
            return null;
          }

          const match = line.match(COMMAND_NAME_REGEX);
          if (!match) {
            return null;
          }

          let description = line.split(match[1])[1].trim();
          if (index + 1 <= commandLines.length) {
            const nextLine = commandLines[index + 1].replaceAll(/^ {2}/gm, '');
            if (nextLine.charAt(0) === ' ') {
              description += ` ${nextLine.trim()}`;
            }
          }

          return {
            name: match[1],
            description,
          };
        })
        .filter((event) => event !== null);

      console.info(`Found ${events.length} events for ${service}\n`);

      return {
        service,
        events,
      };
    }

    console.info(`No events found for ${service}\n`);

    return {
      service,
      events: [],
    };
  } catch (error) {
    console.error(`✗ Failed to generate templates for ${service}: ${error.message}`);
    return {
      service,
      error: error.message,
      events: [],
    };
  }
}

async function validateSamInstallation() {
  try {
    await $`sam --version`;
    console.info('✓ SAM CLI is installed and accessible');
    return true;
  } catch (_error) {
    console.error('✗ SAM CLI is not installed or not accessible');
    console.error(
      'Please install AWS SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html',
    );
    return false;
  }
}

async function main() {
  console.info('🚀 Starting AWS SAM Event Template Generation');
  console.info('=============================================\n');

  // Validate SAM CLI installation
  if (!(await validateSamInstallation())) {
    process.exit(1);
  }

  const promises = AWS_SERVICES.map(generateServiceTemplates);
  const results = await Promise.all(promises);

  await fs.writeFile(SERVICES_FILE, JSON.stringify(results, null, 2));

  console.info('🎉 Services generated successfully');
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
