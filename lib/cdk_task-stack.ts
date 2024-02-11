import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayStack } from './api-gateway-stack';
import { HelloWorldLambdaStack } from './hello-world-lambda';
import { CloudFrontStack } from './cloudfront-stack';

export class CdkTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Create HelloWorldLambdaStack
        const helloWorldLambdaStack = new HelloWorldLambdaStack(this, 'HelloWorldLambdaStack');

        // Create ApiGatewayStack and pass the Lambda function from HelloWorldLambdaStack
        const apiGatewayStack = new ApiGatewayStack(this, 'ApiGatewayStack', helloWorldLambdaStack.lambdaFunction);

        // Pass the S3 bucket created by ApiGatewayStack to CloudFrontStack
        const cloudFrontStack = new CloudFrontStack(this, 'CloudFrontStack',apiGatewayStack.bucket);
    }
}
