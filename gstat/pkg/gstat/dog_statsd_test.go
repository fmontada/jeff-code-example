package gstat_test

import (
	"context"
	"github.com/gap-commerce/glog/test"
	"github.com/gap-commerce/gstat/pkg/gstat"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/net/nettest"
)

func TestDogStatsD(t *testing.T) {
	const (
		serviceName      = "service_name"
		counterStatName  = "metric.total"
		durationStatName = "metric.duration"
	)

	t.Run("can increment", func(t *testing.T) {
		t.Run("with tags", func(t *testing.T) {
			// Given
			listener := newUDPListener(t)
			logger := test.NewLogRecorder()
			tags := []string{"configs:dev", "location:east"}
			statsD, err := gstat.NewDogStatsD(listener.Addr(), serviceName, logger, tags...)
			require.NoError(t, err)

			// When
			statsD.Increment(counterStatName)

			// Then
			require.NoError(t, err)
			assert.Contains(t,
				listener.Read(100),
				"service_name.metric.total:1|c|#configs:dev,location:east")
			assert.Nil(t, logger.Errors)
		})

		t.Run("without tags", func(t *testing.T) {
			// Given
			listener := newUDPListener(t)
			logger := test.NewLogRecorder()
			statsD, err := gstat.NewDogStatsD(listener.Addr(), serviceName, logger)
			require.NoError(t, err)

			// When
			statsD.Increment(counterStatName)

			// Then
			require.NoError(t, err)
			assert.Contains(t, listener.Read(100), "service_name.metric.total:1|c")
			assert.Nil(t, logger.Errors)
		})
	})

	t.Run("can add timing", func(t *testing.T) {
		// Given
		listener := newUDPListener(t)
		logger := test.NewLogRecorder()
		tags := []string{"configs:dev", "location:east"}
		statsD, err := gstat.NewDogStatsD(listener.Addr(), serviceName, logger, tags...)
		require.NoError(t, err)

		// When
		statsD.Timing(context.Background(), durationStatName, time.Second)

		// Then
		require.NoError(t, err)
		assert.Contains(t, listener.Read(100), "service_name.metric.duration:1000.000000|ms|#configs:dev,location:east")
		assert.Nil(t, logger.Errors)
	})

	t.Run("fails from invalid addr", func(t *testing.T) {
		// Given
		logger := test.NewLogRecorder()

		// When
		_, err := gstat.NewDogStatsD("invalid", serviceName, logger)

		// Then
		require.Error(t, err)
	})
}

type udpListener struct {
	listener net.PacketConn
	t        *testing.T
}

func newUDPListener(t *testing.T) *udpListener {
	listener, err := nettest.NewLocalPacketListener("udp")
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, listener.Close())
	})

	return &udpListener{
		listener: listener,
		t:        t,
	}
}

func (l *udpListener) Addr() string {
	return l.listener.LocalAddr().String()
}

func (l *udpListener) Read(length int) string {
	l.t.Helper()
	buff := make([]byte, length)
	_, _, err := l.listener.ReadFrom(buff)
	require.NoError(l.t, err)
	return string(buff)
}

func (l *udpListener) Close() {
	require.NoError(l.t, l.listener.Close())
}
