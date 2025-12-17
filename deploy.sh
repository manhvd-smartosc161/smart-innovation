#!/bin/bash

# Check if bucket name is provided
if [ -z "$1" ]; then
  echo "Error: Bucket name is required."
  echo "Usage: ./deploy.sh <bucket-name>"
  exit 1
fi

BUCKET_NAME=$1

echo "Building project..."
yarn build:no-verify

if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

echo "Deploying to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ s3://$BUCKET_NAME --delete

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi
