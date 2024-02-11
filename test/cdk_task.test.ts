import * as cdk from "aws-cdk-lib";
import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { HelloWorldLambdaStack } from "../lib/hello-world-lambda";
import { CloudFrontStack } from "../lib/cloudfront-stack";
import { ApiGatewayStack } from "../lib/api-gateway-stack";

let app: cdk.App;
let lamdaStack: HelloWorldLambdaStack;
let cloudFrontStackStack: CloudFrontStack;
let apiGatewayStack: ApiGatewayStack;

beforeEach(async () => {
  app = new cdk.App();
  lamdaStack = new HelloWorldLambdaStack(app, "TestLamdaStack");
  cloudFrontStackStack = new CloudFrontStack(app, "TestCloudFrontStack");
  apiGatewayStack = new ApiGatewayStack(
    app,
    "TestApiGatewayStack",
    lamdaStack.lambdaFunction
  );
  await app.synth(); // Wait for stack to deploy
});

test("Stack contains necessary resources", () => {
  expectCDK(lamdaStack).to(
    haveResource("AWS::Lambda::Function", {
      // Add properties to match for Lambda function
    })
  );

  // Validate that the stack contains an API Gateway RestApi resource
  expectCDK(apiGatewayStack).to(haveResource("AWS::ApiGateway::RestApi"));

  expectCDK(cloudFrontStackStack).to(
    haveResource("AWS::CloudFront::Distribution", {
      // Add properties to match for CloudFront function
    })
  );
});
