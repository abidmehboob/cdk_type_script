import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_s3 as s3,aws_iam as iam, aws_lambda as lambda, aws_apigateway as apigateway}  from 'aws-cdk-lib';

export class ApiGatewayStack extends cdk.Stack {
    public readonly bucket: s3.Bucket; // Define 'bucket' property
    constructor(scope: Construct, id: string, lambdaFunction: lambda.Function, props?: cdk.StackProps) {
        super(scope, id, props);

        // Define IAM role for API Gateway
        const apiGatewayRole = new iam.Role(this, 'ApiGatewayRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            // Define inline policies or managed policies here if needed
        });

        // Attach a policy to the API Gateway role granting permissions to execute the Lambda function
        apiGatewayRole.addToPolicy(new iam.PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [lambdaFunction.functionArn],
        }));
        

        const api = new apigateway.RestApi(this, 'HelloWorldApi', {
            restApiName: 'HelloWorld API',
            description: 'API for the HelloWorld Lambda',
            deployOptions: {
                stageName: 'prod',
                metricsEnabled: true,
                loggingLevel: apigateway.MethodLoggingLevel.INFO,

            },
            endpointTypes: [apigateway.EndpointType.PRIVATE],
            // Attach the IAM role to the API Gateway
            policy: new iam.PolicyDocument({
                statements: [new iam.PolicyStatement({
                    actions: ['execute-api:Invoke'],
                    effect: iam.Effect.ALLOW,
                    principals: [new iam.AnyPrincipal()],
                    resources: ['execute-api:/*'],
                    conditions: {
                        'StringEquals': {
                            'aws:SourceVpce': '*'
                        }
                    }
                })]
            })

        });


        const integration = new apigateway.LambdaIntegration(lambdaFunction);
        const helloWorldResource = api.root.addResource('hello');
        helloWorldResource.addMethod('GET', integration);
        this.bucket = new s3.Bucket(this, 'ApiGatewayBucket', {
             accessControl: s3.BucketAccessControl.PRIVATE, // Set the access control to private
        });
        // Allow API Gateway to access S3 bucket
        this.bucket.grantReadWrite(apiGatewayRole);

    }
}
