package app

import (
	"net/http"
	"strings"
)

func (a *App) CorsMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		a.addRespCorsHeader(w, r)
		if r.Method == http.MethodOptions {
			return
		}
		h.ServeHTTP(w, r)
	})
}

func (a *App) addRespCorsHeader(w http.ResponseWriter, r *http.Request) {
	regOrigin := r.Header.Get("Origin")
	allowedOrigins := strings.Split(a.Config.AllowedOrigins, ",")

	for _, v := range allowedOrigins {

		if v == regOrigin || v == "*" {
			w.Header().Set("Access-Control-Allow-Origin", regOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		}
	}
}
