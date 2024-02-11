import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/api-gateway-stack'; // Assuming your stack is defined in ApiGatewayStack.ts
import { aws_s3 as s3, aws_lambda as lambda, aws_iam as iam, aws_apigateway as apigateway } from 'aws-cdk-lib';
import { HelloWorldLambdaStack } from '../lib/hello-world-lambda';

describe('ApiGatewayStack', () => {
    let app: cdk.App;
    let stack: ApiGatewayStack;
    let lambdaFunction: lambda.Function;
    let lamdaStack: HelloWorldLambdaStack;

    beforeAll(() => {
      app = new cdk.App();
      lamdaStack = new HelloWorldLambdaStack(app, 'TestLambdaStack');

      lambdaFunction = new lambda.Function(lamdaStack, 'TestLambda', {
          runtime: lambda.Runtime.NODEJS_14_X,
          handler: 'index.handler',
          code: lambda.Code.fromInline('exports.handler = async function(event, context) { return {statusCode: 200, body: "Hello"}; }'),
      });

      // Pass the lambda function to the stack constructor
      stack = new ApiGatewayStack(app, 'TestApiGatewayStack', lambdaFunction);
    });

    test('stack has S3 bucket', () => {
        expect(stack).toHaveProperty('bucket');
        expect(stack.bucket).toBeInstanceOf(s3.Bucket);
    });

    test('stack has API Gateway', () => {
        const apiGatewayResources = stack.node.children.filter(child => child instanceof apigateway.RestApi);
        expect(apiGatewayResources).toHaveLength(1);
        const apiGateway = apiGatewayResources[0] as apigateway.RestApi;
        expect(apiGateway).toBeDefined();
        expect(apiGateway).toBeInstanceOf(apigateway.RestApi);
    });

    test('stack has correct API Gateway configuration', () => {
        const apiGateway = stack.node.children.find(child => child instanceof apigateway.RestApi) as apigateway.RestApi;
    });

});
