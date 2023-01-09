package app

import (
	"github.com/gap-commerce/glog/pkg/glog"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
)

type option func(*App)

func NewApp(srv Service, config AppConfig, logger glog.Logger, opts ...option) *App {
	app := &App{
		Services: srv,
		Config:   config,
		Logger:   logger,
	}

	for i := range opts {
		opts[i](app)
	}

	return app
}

func WithAuthenticator(authenticator auth.Authenticator) option {
	return func(app *App) {
		app.Authenticator = authenticator
	}
}
