package resolver

import (
	"github.com/gap-commerce/srv-ecommerce/internal/app"
	srvEmberz "github.com/gap-commerce/srv-emberz"
)

type Resolver struct {
	app *app.App
}

func New(app *app.App) *Resolver {
	return &Resolver{app: app}
}

// Mutation returns srv_emberz.MutationResolver implementation.
func (r *Resolver) Mutation() srvEmberz.MutationResolver { return &mutationResolver{r} }

// Query returns srv_emberz.QueryResolver implementation.
func (r *Resolver) Query() srvEmberz.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
