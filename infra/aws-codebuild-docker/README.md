Ensure you have installed the latest version of the AWS CLI and Docker. For more information, see the ECR documentation .
Retrieve the login command to use to authenticate your Docker client to your registry.
Use the AWS CLI:

`$(aws ecr get-login --no-include-email --region us-west-1 | sed -e 's/-e none//g')`

Note: If you receive an "Unknown options: --no-include-email" error when using the AWS CLI, ensure that you have the latest version installed. Learn more
Build your Docker image using the following command. For information on building a Docker file from scratch see the instructions here . You can skip this step if your image is already built:

`docker build -t gc/codebuild-next-storefront .`

After the build completes, tag your image so you can push the image to this repository:

`docker tag gc/codebuild-next-storefront:latest 121464863648.dkr.ecr.us-west-1.amazonaws.com/gc/codebuild-next-storefront:latest`

Run the following command to push this image to your newly created AWS repository:

`docker push 121464863648.dkr.ecr.us-west-1.amazonaws.com/gc/codebuild-next-storefront:latest`
