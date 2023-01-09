package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	"github.com/gap-commerce/srv-ecommerce/internal/resolver"
	schema "github.com/gap-commerce/srv-emberz"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	forwardingHeaders "github.com/gap-commerce/srv-emberz/pkg/forwarding_headers"
	"github.com/gap-commerce/srv-emberz/pkg/model"
	"github.com/gorilla/mux"
)

var (
	version   string
	build     string
	env       string
	awsRegion = "us-west-1"

	// https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
	serviceName     = os.Getenv("AWS_LAMBDA_FUNCTION_NAME")
	accessKeyID     = os.Getenv("AWS_ACCESS_KEY_ID")
	secretAccessKey = os.Getenv("AWS_SECRET_ACCESS_KEY")
	sessionToken    = os.Getenv("AWS_SESSION_TOKEN")
)

var router *mux.Router

func init() {
	flag.Parse()

	app, err := app.ConfigFromEnv(serviceName, version, build)
	if err != nil {
		panic("invalid config")
	}

	rsv := resolver.New(app)
	c := schema.Config{
		Resolvers: rsv,
	}

	// auth directive
	c.Directives.Auth = func(
		ctx context.Context,
		obj interface{},
		next graphql.Resolver,
		roles []*model.Role,
	) (interface{}, error) {
		user := auth.GetUserFromCtx(ctx)

		if user == nil {
			return nil, fmt.Errorf("access denied")
		}

		// check if the roles of the user on ctx are contained
		// on the auth annotation
		var ctxRoles []string
		for i := range roles {
			ctxRoles = append(ctxRoles, roles[i].String())
		}

		if !auth.HasRole(ctxRoles, user.Roles) {
			return nil, fmt.Errorf("access denied")
		}

		return next(ctx)
	}

	router = mux.NewRouter()
	router.Use(app.CorsMiddleware)

	if !strings.Contains(app.Config.Env, "prod") {
		router.Handle("/graphiql", playground.Handler("GC GraphQL playground", "/dev/query"))
	}

	secureRoute := router.PathPrefix("").Subrouter()
	secureRoute.Use(
		app.Authenticator.Authentication,
		app.Authenticator.Authorization,
		forwardingHeaders.ForwardingHeaders,
	)

	server := handler.NewDefaultServer(schema.NewExecutableSchema(c))
	server.SetRecoverFunc(func(ctx context.Context, err interface{}) error {
		app.Logger.Error(err)

		if _, ok := err.(error); !ok {
			return errors.New("internal server error")
		}

		return err.(error)
	})

	secureRoute.Handle("/query", server)
}

func lambdaHandler(
	ctx context.Context,
	req events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	muxAdapter := gorillamux.New(router)

	rsp, err := muxAdapter.Proxy(req)
	if err != nil {
		panic(err)
	}
	return rsp, err
}

func main() {
	isRunningAtLambda := strings.Contains(
		os.Getenv("AWS_EXECUTION_ENV"),
		"AWS_Lambda_",
	)

	if isRunningAtLambda {
		lambda.Start(lambdaHandler)
	} else {
		fmt.Printf("Running on port %d\n", 8080)
		err := http.ListenAndServe(fmt.Sprintf(":%d", 8080), router)
		if err != nil {
			panic(err)
		}
	}
}
