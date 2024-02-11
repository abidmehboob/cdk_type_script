import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { ApiGatewayStack } from "../lib/api-gateway-stack";
import { HelloWorldLambdaStack } from "../lib/hello-world-lambda";

let app: cdk.App;
let stack: ApiGatewayStack;
let lambdaFunction: lambda.Function;
let lamdaStack: HelloWorldLambdaStack;

beforeAll(() => {
  app = new cdk.App();
  lamdaStack = new HelloWorldLambdaStack(app, "TestLambdaStack");

  lambdaFunction = new lambda.Function(lamdaStack, "TestLambda", {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: "index.handler",
    code: lambda.Code.fromInline(
      'exports.handler = async function(event, context) { return {statusCode: 200, body: "Hello"}; }'
    ),
  });

  stack = new ApiGatewayStack(app, "TestApiGatewayStack", lambdaFunction);
});
test("Api Gateway Stack has necessary IAM permissions", () => {
  // Validate API Gateway IAM permissions
  expectCDK(stack).to(
    haveResource("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
          },
        ],
        Version: "2012-10-17",
      },
    })
  );

});

test("Api Gateway Stack has S3 bucket with encryption enabled", () => {
  // Validate S3 bucket encryption settings
  expectCDK(stack).to(
    haveResource("AWS::S3::Bucket", {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    })
  );
});
