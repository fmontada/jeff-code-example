/*
Package gstat provides an abstracting statsd-like interface to
several observability providers.

Integration require the presence of environment variables for
NR_INGEST_LICENSE and ENVIRONMENT and can be run with the following
command:

    go test -tags integration ./lib/gstat/...


*/
package gstat
