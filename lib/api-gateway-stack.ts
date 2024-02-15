import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_apigateway as apigateway,
  aws_logs as logs,
  aws_kms as kms,
} from "aws-cdk-lib";

export class ApiGatewayStack extends cdk.Stack {
  public readonly bucket: s3.Bucket; // Define 'bucket' property
  constructor(
    scope: Construct,
    id: string,
    lambdaFunction: lambda.Function,
    props?: StackProps
  ) {
    super(scope, id, props);

    // Define IAM role for API Gateway
    const apiGatewayRole = new iam.Role(this, "AWSServiceRoleForAPIGateway", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    // Attach a policy to the API Gateway role granting permissions to execute the Lambda function
    apiGatewayRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["lambda:InvokeFunction"],
        resources: [lambdaFunction.functionArn],
      })
    );

    const api = new apigateway.RestApi(this, "HelloWorldApi", {
      restApiName: "HelloWorld API",
      description: "API for the HelloWorld Lambda",
      deployOptions: {
        stageName: "prod",
        metricsEnabled: false,
        //  loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      endpointTypes: [apigateway.EndpointType.PRIVATE],
      // Attach the IAM role to the API Gateway
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["execute-api:Invoke"],
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            resources: ["execute-api:/*"],
            conditions: {
              StringEquals: {
                "aws:SourceVpce": "*",
              },
            },
          }),
        ],
      }),
    });

    const integration = new apigateway.LambdaIntegration(lambdaFunction);
    const helloWorldResource = api.root.addResource("hello");
    helloWorldResource.addMethod("GET", integration);

    // Create an S3 bucket with encryption enabled
    this.bucket = new s3.Bucket(this, "ApiGatewayBucket", {
      accessControl: s3.BucketAccessControl.PRIVATE,
      encryption: s3.BucketEncryption.S3_MANAGED, // Encrypt objects using S3-managed keys
    });

    // Allow API Gateway to access S3 bucket
    this.bucket.grantReadWrite(apiGatewayRole);

    // Create a KMS key for encryption
    const kmsKey = new kms.Key(this, "ApiGatewayLogKey", {
      enableKeyRotation: true,
    });

    // Create CloudWatch log group with retention policy and encryption
    const logGroup = new logs.LogGroup(this, "ApiGatewayLogGroup", {
      retention: logs.RetentionDays.ONE_WEEK, // Set retention policy to one week
      encryptionKey: kmsKey, // Encrypt logs using KMS
    });

    // Grant permissions for API Gateway to write logs to the log group
    logGroup.grantWrite(apiGatewayRole);
  }
}
