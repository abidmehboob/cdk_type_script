import * as cdk from 'aws-cdk-lib';
import {aws_s3 as s3,aws_iam as iam, aws_lambda as lambda}  from 'aws-cdk-lib';
import { HelloWorldLambdaStack } from '../lib/hello-world-lambda';

describe('HelloWorldLambdaStack', () => {
  let app: cdk.App;
  let stack: HelloWorldLambdaStack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new HelloWorldLambdaStack(app, 'TestStack');
  });

  test('stack has a lambda function', () => {
    expect(stack).toHaveProperty('lambdaFunction');
    expect(stack.lambdaFunction).toBeDefined();
  });

  test('lambda function has correct properties', () => {
    const lambdaFunction = stack.lambdaFunction;
    expect(lambdaFunction.runtime).toEqual(lambda.Runtime.NODEJS_14_X);
    // You may add more assertions for other properties as needed
  });

  // You can add more tests as needed to cover additional functionality
});
