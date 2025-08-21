#!/usr/bin/env zx

import fs from 'node:fs/promises';
import path from 'node:path';
import { $ } from 'zx';

import services from '../public/data/services.json' with { type: 'json' };

// Template storage directory
const TEMPLATES_DIR = './public/data/templates';

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.info(logMessage.trim());
}

async function generateServiceTemplates(service, samVersion) {
  const { service: serviceName, events } = service;

  try {
    log(`Generating templates for service: ${serviceName}`);

    // Create service directory
    const serviceFile = path.join(TEMPLATES_DIR, `${serviceName}.json`);

    const promises = events.map(async (event) => {
      try {
        log(`  Generating ${serviceName}:${event.name}`);

        // Generate the event template
        const { stdout: template } = await $`sam local generate-event ${serviceName} ${event.name}`;

        // Parse the template
        const parsedTemplate = JSON.parse(template);

        log(`  ✓ Generated ${serviceName}:${event.name}`);

        // Store the template
        return {
          eventName: event.name,
          template: parsedTemplate,
        };
      } catch (error) {
        log(`  ✗ Failed to generate ${serviceName}:${event.name} - ${error.message}`);
      }

      return null;
    });

    const serviceTemplates = (await Promise.all(promises)).filter((t) => t !== null);

    // Generate service metadata
    const content = {
      service: serviceName,
      eventNames: events.map((e) => e.name),
      lastUpdated: new Date().toISOString(),
      samVersion,
      templates: serviceTemplates,
    };

    // Save service templates to file
    await fs.writeFile(serviceFile, JSON.stringify(content, null, 2));

    log(`✓ Completed ${serviceName} - ${content.templates.length} templates generated`);
    return content;
  } catch (error) {
    log(`✗ Failed to generate templates for ${serviceName}: ${error.message}`);
    return null;
  }
}

async function getSamVersion() {
  try {
    const { stdout } = await $`sam --version`;
    return stdout.trim();
  } catch {
    return 'unknown';
  }
}

async function validateSamInstallation() {
  try {
    await $`sam --version`;
    log('✓ SAM CLI is installed and accessible');
    return true;
  } catch (_error) {
    log('✗ SAM CLI is not installed or not accessible');
    log(
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

  // Ensure templates directory exists
  await ensureDirectoryExists(TEMPLATES_DIR);

  const samVersion = await getSamVersion();

  const promises = services.map(async (service) => {
    const result = await generateServiceTemplates(service, samVersion);
    if (result) {
      return result;
    }

    return {
      error: 'No event types found',
      eventNames: [],
      service: service.service,
      templates: [],
    };
  });

  const results = await Promise.all(promises);

  // Summary
  const totalTemplates = results.reduce((sum, r) => sum + r.eventNames.length, 0);
  const successfulServices = results.filter((r) => r.eventNames.length > 0).length;

  console.info('\n🎉 Template Generation Complete!');
  console.info('================================');
  console.info(`Services processed: ${successfulServices}/${services.length}`);
  console.info(`Total templates generated: ${totalTemplates}`);
  console.info(`Templates directory: ${TEMPLATES_DIR}`);
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
