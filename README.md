# jeff-code-example

## Omaze auth0

`/auth0`

I worked on this project for over six months. The goal of this project was to replace the Shopify IPD with Auth0 IPD
so we could own the user data. Instead of users login into Shopify, users could log in to our own IDP services, and
owning the Authentication/Authorization was what we considered as the first step to start building User Profile
Feature to help with the business retention. I wrote 90% of the js/src/*.js. Those are Auth0 Rules; basically, 
javascript funcs that allow us to customize the login flows/data, base in our use case. 

## E-commerce backend service
`/e-com-srv`

This is a backend Graphql server implementation, a personal project I worked on like a year ago. 
It is written in Golang, I architected/designed the project and wrote more than 50% of the code

## Libs
This are libs that I built that can be used in any project for, logger, config, and stats 

##### `glog` (Logger)
##### `srv-utils` (Load config file into an object)
##### `gstat` (Datadog and Newrelic instrumentation)

## Infra
For the E-commerce project mentioned above, it was deploy using AWS serverless architecture, 
Lambda, API Gateway, Cognito, S3 so this `infra` project is a `tf` project to provisioning all the AWS 
the resources, I wrote 100% of this project.

`/infra`

