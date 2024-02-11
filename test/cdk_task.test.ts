import * as cdk from 'aws-cdk-lib';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from 'aws-cdk-lib';
import { CdkTaskStack } from '../lib/cdk_task-stack';
import { HelloWorldLambdaStack } from '../lib/hello-world-lambda';
import { CloudFrontStack } from '../lib/cloudfront-stack'; 

let app: cdk.App;
let lamdaStack: HelloWorldLambdaStack;
let cloudFrontStackStack: CloudFrontStack;

beforeEach(async () => {
  app = new cdk.App();
  lamdaStack = new HelloWorldLambdaStack(app, 'TestLamdaStack');
  cloudFrontStackStack = new CloudFrontStack(app, 'TestCloudFrontStack');
  await app.synth(); // Wait for stack to deploy
});

test('Stack contains necessary resources', () => {
  expectCDK(lamdaStack).to(haveResource('AWS::Lambda::Function', {
    // Add properties to match for Lambda function
  }));

  expectCDK(cloudFrontStackStack).to(haveResource('AWS::CloudFront::Distribution', {
    // Add properties to match for CloudFront function
  }));
});
