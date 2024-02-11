import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_iam as iam,
  aws_lambda as lambda,
} from "aws-cdk-lib";

export class HelloWorldLambdaStack extends cdk.Stack {
  public lambdaFunction: lambda.Function; // Define the lambdaFunction property

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define IAM role for the Lambda function
    const lambdaRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      // Define inline policies or managed policies here if needed
    });
    this.lambdaFunction = new lambda.Function(this, "HelloWorldFunction", {
      // Assign the lambda function to the property
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
      role: lambdaRole, // Assign the IAM role to the Lambda function
    });
  }
}
