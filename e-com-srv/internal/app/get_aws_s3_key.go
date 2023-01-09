package app

import "fmt"

func (a *App) GetResourceKey(accountId, storeID, key string) string {
	return fmt.Sprintf("%s/%s/%s", accountId, storeID, key)
}
