# AWS SAM Event Generator

A modern web application built with Next.js that generates AWS SAM event payloads for local testing. This tool helps developers quickly generate realistic event payloads for various AWS services to test serverless functions locally using AWS SAM CLI.

![demo](https://raw.githubusercontent.com/tericcabrel/savemenge/main/public/images/og.png)

## 🚀 Features

- **20+ AWS Services Support**: Generate events for major AWS services including API Gateway, Lambda, S3, DynamoDB, SQS, SNS, and more
- **Interactive UI**: Clean, modern interface built with React and Tailwind CSS
- **Event Customization**: Inject custom JSON payloads into specific event paths
- **Export Options**: Copy generated events to clipboard or download as JSON files
- **Real-time Validation**: JSON validation with error feedback
- **Service Categories**: Organized by service categories (Compute, Storage, Database, Messaging, etc.)
- **Template Management**: Automated template generation from SAM CLI

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting
- **Testing**: [Vitest](https://vitest.dev/)
- **Monitoring**: [Sentry](https://sentry.io/)
- **Package Manager**: Yarn v4

## 📋 Prerequisites

- **Node.js** 18+ 
- **Yarn** 4.9.2+ (recommended) or npm
- **AWS SAM CLI** - Required for generating event templates

### Installing AWS SAM CLI

Follow the [official AWS SAM CLI installation guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) for your operating system.

Verify installation:
```bash
sam --version
```

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd samevenge
yarn install
```

### 2. Generate AWS Service Data

Before running the application, generate the AWS services and event templates:

```bash
# Generate list of available AWS services and their events
yarn generate-services

# Generate event templates for all services
yarn generate-templates
```

### 3. Start Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

### Development
- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build production application
- `yarn start` - Start production server

### Code Quality
- `yarn lint` - Check code with Biome
- `yarn lint:fix` - Fix linting issues automatically
- `yarn format` - Check code formatting
- `yarn format:fix` - Fix formatting issues automatically
- `yarn type-check` - Run TypeScript type checking

### Testing
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:ui` - Run tests with UI

### Data Generation
- `yarn generate-services` - Generate AWS services list from SAM CLI
- `yarn generate-templates` - Generate event templates for all services

## 🎯 How to Use

### 1. Select AWS Service
Choose from 20+ supported AWS services organized by categories:
- **Compute**: API Gateway, AppSync, Step Functions
- **Storage**: S3, CloudFront
- **Database**: DynamoDB
- **Messaging**: SQS, SNS, Kinesis
- **AI/ML**: Alexa Skills Kit, Lex, Rekognition
- **And more...**

### 2. Choose Event Type
Each service offers multiple event types. For example:
- **S3**: `put`, `delete`, `batch-invocation`
- **API Gateway**: `aws-proxy`, `http-api-proxy`, `authorizer`
- **DynamoDB**: `update`

### 3. Customize Event (Optional)
Inject custom JSON data into specific event paths. The application supports:
- **JSON objects**: For complex nested data
- **String values**: For simple text data

### 4. Generate and Export
- Click "Generate Event" to create the payload
- Copy to clipboard for immediate use
- Download as JSON file for later use

## 🏗️ Project Structure

```
samevenge/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── home/              # Home page components
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Card, etc.)
│   │   └── layout/           # Layout components
│   ├── hooks/                # React hooks
│   │   └── use-event-generator.ts  # Main event generation logic
│   ├── lib/                  # Utility functions
│   ├── constants/            # AWS services configuration
│   └── types/                # TypeScript type definitions
├── public/
│   └── data/                 # Generated AWS service data
│       ├── services.json     # Services and events list
│       └── templates/        # Event templates by service
├── scripts/                  # Data generation scripts
│   ├── generate-services.mjs # Generate services list
│   └── generate-templates.mjs # Generate event templates
└── package.json
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

- `NEXT_PUBLIC_SAM_CLI_VERSION` - SAM CLI version (displayed in UI)

### Biome Configuration

The project uses Biome for code quality [[memory:6444941]]. Configuration is in `biome.jsonc`.

## 🧪 Testing

The project includes unit tests for utility functions:

```bash
# Run all tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Run tests with UI
yarn test:ui
```

## 📝 Adding New AWS Services

To add support for new AWS services:

1. **Check SAM CLI Support**: Verify the service is supported by running:
   ```bash
   sam local generate-event --help
   ```

2. **Update Scripts**: Add the service name to the `AWS_SERVICES` array in `scripts/generate-services.mjs`

3. **Configure Service**: Add service configuration to `SERVICES_MAP` in `src/constants/aws-services.ts`:
   ```typescript
   'service-name': {
     category: 'appropriate-category',
     displayName: 'Service Display Name',
     description: 'Service description',
     eventsBodyPath: {
       'event-name': { path: 'json.path', type: 'json' } | null
     }
   }
   ```

4. **Regenerate Data**:
   ```bash
   yarn generate-services
   yarn generate-templates
   ```

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

### Deploy to Vercel

The application is optimized for deployment on [Vercel](https://vercel.com/):

1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and ensure tests pass
4. Run code quality checks: `yarn lint` and `yarn format`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for providing event generation capabilities
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Biome](https://biomejs.dev/) for fast code quality tools