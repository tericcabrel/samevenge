export type TemplateMetadata = {
  service: string;
  eventType: string;
  generatedAt: string;
  samVersion: string;
};

export type TemplateData = {
  template: Record<string, any>;
  metadata: TemplateMetadata;
};

export type ServiceMetadata = {
  service: string;
  eventTypes: string[];
  totalTemplates: number;
  lastUpdated: string;
  samVersion: string;
};

export type TemplatesIndex = {
  generatedAt: string;
  totalServices: number;
  totalTemplates: number;
  samVersion: string;
  services: ServiceMetadata[];
};

export type ServiceTemplates = {
  [eventType: string]: TemplateData;
};

// AWS Service types for better type safety
export type AWSService =
  | 'alexa-skills-kit'
  | 'alexa-smarthome'
  | 'apigateway'
  | 'appsync'
  | 'autoscaling'
  | 'cloudformation'
  | 'cloudfront'
  | 'cloudwatch'
  | 'codecommit'
  | 'codepipeline'
  | 'cognito'
  | 'config'
  | 'connect'
  | 'dynamodb'
  | 'ec2'
  | 'elasticache'
  | 'elasticsearch'
  | 'elb'
  | 'events'
  | 'iot'
  | 'kinesis'
  | 'lex'
  | 'rekognition'
  | 's3'
  | 'ses'
  | 'sns'
  | 'sqs'
  | 'stepfunctions';

// Common event structure types
export type S3Event = {
  Records: Array<{
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: string;
    eventName: string;
    s3: {
      s3SchemaVersion: string;
      configurationId: string;
      bucket: {
        name: string;
        ownerIdentity: {
          principalId: string;
        };
        arn: string;
      };
      object: {
        key: string;
        size: number;
        eTag: string;
        sequencer: string;
      };
    };
  }>;
};

export type DynamoDBEvent = {
  Records: Array<{
    eventID: string;
    eventName: string;
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    dynamodb: {
      ApproximateCreationDateTime: number;
      Keys: Record<string, any>;
      NewImage?: Record<string, any>;
      OldImage?: Record<string, any>;
      SequenceNumber: string;
      SizeBytes: number;
      StreamViewType: string;
    };
    eventSourceARN: string;
  }>;
};

export type APIGatewayEvent = {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string>;
  pathParameters?: Record<string, string>;
  stageVariables?: Record<string, string>;
  requestContext: {
    resourceId: string;
    resourcePath: string;
    httpMethod: string;
    extendedRequestId: string;
    requestTime: string;
    path: string;
    accountId: string;
    protocol: string;
    stage: string;
    domainPrefix: string;
    requestTimeEpoch: number;
    requestId: string;
    identity: {
      cognitoIdentityPoolId?: string;
      accountId?: string;
      cognitoIdentityId?: string;
      caller?: string;
      sourceIp: string;
      principalOrgId?: string;
      accessKey?: string;
      cognitoAuthenticationType?: string;
      cognitoAuthenticationProvider?: string;
      userArn?: string;
      userAgent?: string;
      user?: string;
    };
    domainName: string;
    apiId: string;
  };
  body?: string;
  isBase64Encoded: boolean;
};

export type EventBridgeEvent = {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: Record<string, any>;
};

export type SQSEvent = {
  Records: Array<{
    messageId: string;
    receiptHandle: string;
    body: string;
    attributes: {
      ApproximateReceiveCount: string;
      SentTimestamp: string;
      SenderId: string;
      ApproximateFirstReceiveTimestamp: string;
    };
    messageAttributes: Record<string, any>;
    md5OfBody: string;
    eventSource: string;
    eventSourceARN: string;
    awsRegion: string;
  }>;
};

export type SNSEvent = {
  Records: Array<{
    EventVersion: string;
    EventSubscriptionArn: string;
    EventSource: string;
    Sns: {
      Type: string;
      MessageId: string;
      TopicArn: string;
      Subject?: string;
      Message: string;
      Timestamp: string;
      SignatureVersion: string;
      Signature: string;
      SigningCertUrl: string;
      UnsubscribeUrl: string;
      MessageAttributes: Record<string, any>;
    };
  }>;
};
