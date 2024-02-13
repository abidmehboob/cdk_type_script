import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_iam as iam,
  aws_cloudfront_origins as origins,
} from "aws-cdk-lib";
export class CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    // Create an S3 bucket for the website content
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      }),
    });

    // websiteBucket.addToResourcePolicy(
    //   new iam.PolicyStatement({
    //     actions: ["s3:GetObject"],
    //     resources: [websiteBucket.arnForObjects("*")],
    //     principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
    //   })
    // );

    // Create a CloudFront distribution that uses the S3 bucket as its origin
    const cloudfrontDistribution = new cloudfront.Distribution(
      this,
      "test-distribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(websiteBucket),
        },
      }
    );

     // Add a bucket policy to allow CloudFront to access objects in the S3 bucket
     websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [websiteBucket.arnForObjects("*")],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
      })
    );
  }
}
