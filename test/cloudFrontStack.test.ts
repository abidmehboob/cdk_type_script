import { CloudFrontStack } from '../lib/cloudfront-stack'; // Assuming CloudFrontStack is in a file named CloudFrontStack.ts
import * as cdk from 'aws-cdk-lib';

describe('CloudFrontStack', () => {
  test('creates a CloudFront distribution with correct configuration', () => {
    // Arrange
    const app = new cdk.App();
    const stack = new CloudFrontStack(app, 'TestStack');

    // Act
    const distribution = stack.node.findChild('test-distribution');

    // Assert
    expect(distribution).toBeDefined();
    expect(distribution).toHaveProperty('distributionId');
  });
});
