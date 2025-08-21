import services from '../../public/data/services.json' with { type: 'json' };

type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'database'
  | 'messaging'
  | 'analytics'
  | 'ai'
  | 'security'
  | 'iac'
  | 'cicd'
  | 'authentication'
  | 'configuration'
  | 'other';

type ServiceData = {
  service: string;
  events: {
    name: string;
    description: string;
  }[];
};

const SERVICES_MAP: Record<
  string,
  {
    category: ServiceCategory;
    displayName: string;
    description: string;
    eventsBodyPath: Record<string, { path: string; type: 'json' | 'string' } | null>;
  }
> = {
  'alexa-skills-kit': {
    category: 'ai',
    displayName: 'Alexa Skills Kit',
    description: 'Voice app development',
    eventsBodyPath: {
      'end-session': null,
      'intent-answer': { path: 'session.attributes', type: 'json' },
      'intent-getnewfact': { path: 'request.intent', type: 'json' },
      'intent-mycoloris': { path: 'request.intent', type: 'json' },
      'intent-recipe': { path: 'request.intent', type: 'json' },
      'start-session': null,
    },
  },
  apigateway: {
    category: 'compute',
    displayName: 'Amazon API Gateway',
    description: 'API management service',
    eventsBodyPath: {
      authorizer: null,
      'aws-proxy': { path: 'body', type: 'string' },
      'http-api-proxy': { path: 'body', type: 'string' },
      'request-authorizer': null,
    },
  },
  appsync: {
    category: 'compute',
    displayName: 'AWS AppSync',
    description: 'GraphQL service',
    eventsBodyPath: {
      resolver: { path: 'info', type: 'json' },
    },
  },
  cloudformation: {
    category: 'iac',
    displayName: 'AWS CloudFormation',
    description: 'Infrastructure as code',
    eventsBodyPath: {
      'create-request': { path: 'ResourceProperties', type: 'json' },
    },
  },
  cloudfront: {
    category: 'storage',
    displayName: 'Amazon CloudFront',
    description: 'Content delivery network',
    eventsBodyPath: {
      'ab-test': null,
      'access-request-in-response': { path: 'Records[0].cf.response', type: 'json' },
      'http-redirect': null,
      'modify-querystring': null,
      'modify-response-header': { path: 'Records[0].cf.response.headers', type: 'json' },
      'multiple-remote-calls-aggregate-response': null,
      'normalize-querystring-to-improve-cache-hit': {
        path: 'Records[0].cf.request.querystring',
        type: 'string',
      },
      'redirect-on-viewer-country': { path: 'Records[0].cf.request.cloudfront-viewer-country', type: 'json' },
      'redirect-unauthenticated-users': null,
      'response-generation': null,
      'serve-object-on-viewer-device': { path: 'Records[0].cf.request.headers', type: 'json' },
      'simple-remote-call': null,
    },
  },
  cloudwatch: {
    category: 'analytics',
    displayName: 'Amazon CloudWatch',
    description: 'Monitoring and observability',
    eventsBodyPath: {
      logs: { path: 'awslogs.data', type: 'string' },
      'scheduled-event': { path: 'detail', type: 'json' },
    },
  },
  codecommit: {
    category: 'cicd',
    displayName: 'AWS CodeCommit',
    description: 'Source control service',
    eventsBodyPath: {
      repository: { path: 'Records[0].customData', type: 'string' },
    },
  },
  codepipeline: {
    category: 'cicd',
    displayName: 'AWS CodePipeline',
    description: 'CI/CD service',
    eventsBodyPath: {
      job: null,
    },
  },
  cognito: {
    category: 'authentication',
    displayName: 'Amazon Cognito',
    description: 'User authentication service',
    eventsBodyPath: {
      'sync-trigger': { path: 'datasetRecords', type: 'json' },
    },
  },
  config: {
    category: 'configuration',
    displayName: 'AWS Config',
    description: 'Configuration management',
    eventsBodyPath: {
      'item-change-notification': { path: 'invokingEvent', type: 'string' },
      'oversized-item-change-notification': { path: 'invokingEvent', type: 'string' },
      'periodic-rule': { path: 'invokingEvent', type: 'string' },
    },
  },
  connect: {
    category: 'messaging',
    displayName: 'Amazon Connect',
    description: 'Contact center service',
    eventsBodyPath: {
      'contact-flow-event': { path: 'Details.ContactData.CustomerEndpoint', type: 'string' },
    },
  },
  dynamodb: {
    category: 'database',
    displayName: 'Amazon DynamoDB',
    description: 'NoSQL database service',
    eventsBodyPath: {
      update: { path: 'Records[0].dynamodb', type: 'json' },
    },
  },
  s3: {
    category: 'storage',
    displayName: 'Amazon S3',
    description: 'Object storage service',
    eventsBodyPath: {
      'batch-invocation': { path: 'tasks', type: 'json' },
      delete: { path: 'Records[0].s3.object', type: 'json' },
      put: { path: 'Records[0].s3.object', type: 'json' },
    },
  },
  sqs: {
    category: 'messaging',
    displayName: 'Amazon SQS',
    description: 'Message queuing service',
    eventsBodyPath: {
      'receive-message': { path: 'Records[0].body', type: 'string' },
    },
  },
  sns: {
    category: 'messaging',
    displayName: 'Amazon SNS',
    description: 'Pub/sub messaging service',
    eventsBodyPath: {
      notification: { path: 'Records[0].Sns.Message', type: 'string' },
    },
  },
  stepfunctions: {
    category: 'compute',
    displayName: 'AWS Step Functions',
    description: 'Serverless workflow service',
    eventsBodyPath: {
      error: null,
    },
  },
  ses: {
    category: 'messaging',
    displayName: 'Amazon SES',
    description: 'Email service',
    eventsBodyPath: {
      'email-receiving': { path: 'Records[0].ses.receipt.recipients', type: 'json' },
    },
  },
  rekognition: {
    category: 'ai',
    displayName: 'Amazon Rekognition',
    description: 'Image and video analysis',
    eventsBodyPath: {
      's3-request': { path: 'Records[0].s3.object', type: 'json' },
    },
  },
  lex: {
    category: 'ai',
    displayName: 'Amazon Lex',
    description: 'Conversational AI service',
    eventsBodyPath: {
      'book-car': { path: 'currentIntent', type: 'json' },
      'book-hotel': { path: 'currentIntent', type: 'json' },
      'make-appointment': { path: 'currentIntent', type: 'json' },
      'order-flowers': { path: 'currentIntent', type: 'json' },
    },
  },
  kinesis: {
    category: 'messaging',
    displayName: 'Amazon Kinesis',
    description: 'Real-time data streaming',
    eventsBodyPath: {
      analytics: { path: 'records', type: 'json' },
      'analytics-compressed': { path: 'records', type: 'json' },
      'analytics-dynamodb': { path: 'records', type: 'json' },
      'analytics-kpl': { path: 'records', type: 'json' },
      apachelog: { path: 'records', type: 'json' },
      'cloudwatch-logs-processor': { path: 'records', type: 'json' },
      'get-records': { path: 'Records[0].kinesis', type: 'json' },
      'kinesis-firehose': { path: 'records', type: 'json' },
      'streams-as-source': { path: 'records', type: 'json' },
      syslog: { path: 'records', type: 'json' },
    },
  },
};

export type Service = {
  name: string;
  displayName: string;
  description: string;
  category: ServiceCategory;
  eventsBodyPath: Record<string, { path: string; type: 'json' | 'string' } | null>;
};

export const AWS_SERVICES: Service[] = (services as ServiceData[]).map((item) => ({
  name: item.service,
  displayName: SERVICES_MAP[item.service]?.displayName || '',
  description: SERVICES_MAP[item.service]?.description || '',
  category: SERVICES_MAP[item.service]?.category || 'other',
  eventsBodyPath: SERVICES_MAP[item.service]?.eventsBodyPath || {},
}));

export const getServiceByCategory = (category: Service['category']) => {
  return AWS_SERVICES.filter((service) => service.category === category);
};

export const getServiceByName = (name: string) => {
  return AWS_SERVICES.find((service) => service.name === name);
};
