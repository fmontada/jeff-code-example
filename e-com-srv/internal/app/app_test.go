package app

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestVerifyFirebasePassword(t *testing.T) {
	// Given
	app := NewApp(Service{}, AppConfig{}, nil)

	knowHash := "2/vqgY2EfzrDmXhQETThpMS932q99Jraj2fiVKx437GizxNb4nFh5YpLeJXA+O3+on1YxxxPg8MrDAIc1VBDUA=="
	uSalt := "ksWQcmrBs3IzSA=="
	password := "Admin@123"

	saltSeparator := "Bw=="
	rounds := 8
	memCost := 14
	signerKey := "enEBDI/enGI9VK7m08bxlGaVb7KPPtEbEy1rII4fasMhBtLLgow/lTylJz9rWL3tQeTfENI8kNR8q7jNd7yJxw=="


	// When
	v := app.verifyFirebasePassword(signerKey,password, knowHash, uSalt, saltSeparator, rounds, memCost)

	// Then
	assert.Equal(t, true, v)
}
