package app

import (
	"context"
	"errors"
	"github.com/aws/aws-sdk-go-v2/aws"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	cognitoTypes "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/gap-commerce/srv-emberz/pkg/auth"
	"github.com/gap-commerce/srv-emberz/pkg/model"
)

func (a *App) ListUsers(ctx context.Context, accountID string,
	storeID *string) ([]model.User, error) {
	cUser := auth.GetUserFromCtx(ctx)

	if cUser == nil {
		return nil, errors.New("unauthorized request")
	}

	cognitoUsers, err := a.getUserListFromCognito(ctx)
	if err != nil {
		return nil, err
	}

	users := a.MapCognitoUsersToUsers(cognitoUsers)

	if storeID != nil {
		nUsers := make([]model.User, 0)

		for _, user := range users {
			if *user.AccountID == accountID && *user.StoreID == *storeID {
				nUsers = append(nUsers, user)
			}
		}

		return nUsers, nil
	}

	isSuperAdmin := false

	for _, r := range cUser.Roles {
		if r == "SUPER_ADMIN" {
			isSuperAdmin = true
			break
		}
	}

	if !isSuperAdmin {
		return []model.User{}, nil
	}

	stores, err := a.Services.Store.GetByAccount(ctx, accountID, a.Config.StoreKey)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	nUsers := make([]model.User, 0)

	for _, store := range stores {
		for _, user := range users {
			if *user.AccountID == accountID && *store.ID == *user.StoreID {
				nUsers = append(nUsers, user)
			}
		}
	}

	return nUsers, nil
}

func (a *App) GetUser(ctx context.Context, id string) (*model.User, error) {
	params := &cognito.AdminGetUserInput{
		UserPoolId: aws.String(a.Config.CognitoUserPoolID),
		Username:   aws.String(id),
	}

	cUser, err := a.Services.Cognito.AdminGetUser(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	gParams := &cognito.AdminListGroupsForUserInput{
		UserPoolId: aws.String(a.Config.CognitoUserPoolID),
		Username:   aws.String(id),
	}

	rl, err := a.Services.Cognito.AdminListGroupsForUser(ctx, gParams)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	role := rl.Groups[0].GroupName

	user := a.MapCognitoAdminUserToUser(*cUser, role)

	return &user, nil
}

func (a *App) CreateUser(ctx context.Context, u model.User) (*model.User, error) {
	params := &cognito.AdminCreateUserInput{
		UserPoolId:     aws.String(a.Config.CognitoUserPoolID),
		Username:       u.Email,
		UserAttributes: a.formatCognitoAttributes(u),
	}

	adUser, err := a.
		Services.
		Cognito.
		AdminCreateUser(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	u.ID = adUser.User.Username

	pUser := &cognito.AdminAddUserToGroupInput{
		UserPoolId: aws.String(a.Config.CognitoUserPoolID),
		GroupName:  u.Role,
		Username:   u.Email,
	}

	_, err = a.
		Services.
		Cognito.
		AdminAddUserToGroup(ctx, pUser)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return &u, nil
}

func (a *App) UpdateUser(ctx context.Context, u model.User) (*model.User, error) {
	params := &cognito.AdminListGroupsForUserInput{
		UserPoolId: aws.String(a.Config.CognitoUserPoolID),
		Username:   u.Email,
	}

	roleGroup, err := a.Services.Cognito.AdminListGroupsForUser(ctx, params)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	if u.Enabled != nil && *u.Enabled {
		eParams := &cognito.AdminEnableUserInput{
			UserPoolId: aws.String(a.Config.CognitoUserPoolID),
			Username:   u.Email,
		}

		_, err = a.Services.Cognito.AdminEnableUser(ctx, eParams)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}
	} else {
		dParams := &cognito.AdminDisableUserInput{
			UserPoolId: aws.String(a.Config.CognitoUserPoolID),
			Username:   u.Email,
		}

		_, err = a.
			Services.
			Cognito.
			AdminDisableUser(ctx, dParams)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}
	}

	if *u.Role != *roleGroup.Groups[0].GroupName {
		removeGroupParams := &cognito.AdminRemoveUserFromGroupInput{
			UserPoolId: aws.String(a.Config.CognitoUserPoolID),
			Username:   u.Email,
			GroupName:  roleGroup.Groups[0].GroupName,
		}

		_, err = a.
			Services.
			Cognito.
			AdminRemoveUserFromGroup(ctx, removeGroupParams)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}

		addParams := &cognito.AdminAddUserToGroupInput{
			UserPoolId: aws.String(a.Config.CognitoUserPoolID),
			Username:   u.Email,
			GroupName:  u.Role,
		}

		_, err = a.
			Services.
			Cognito.
			AdminAddUserToGroup(ctx, addParams)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}
	}

	updateParams := &cognito.AdminUpdateUserAttributesInput{}

	_, err = a.Services.Cognito.AdminUpdateUserAttributes(ctx, updateParams)
	if err != nil {
		a.Logger.Error(err)
		return nil, err
	}

	return &u, nil
}

func (a *App) getUserListFromCognito(ctx context.Context) ([]cognitoTypes.UserType, error) {
	var token *string
	users := make([]cognitoTypes.UserType, 0)

	for {
		params := &cognito.ListUsersInput{
			UserPoolId:      aws.String(a.Config.CognitoUserPoolID),
			PaginationToken: token,
		}

		r, err := a.Services.Cognito.ListUsers(ctx, params)
		if err != nil {
			a.Logger.Error(err)
			return nil, err
		}

		users = append(users, r.Users...)

		token = r.PaginationToken

		if token == nil {
			break
		}
	}

	return users, nil
}

func (a *App) formatCognitoAttributes(user model.User) []cognitoTypes.AttributeType {
	attrs := []cognitoTypes.AttributeType{
		{
			Name:  aws.String("email"),
			Value: user.Email,
		},
		{
			Name:  aws.String("given_name"),
			Value: user.FirstName,
		},
		{
			Name:  aws.String("family_name"),
			Value: user.LastName,
		},
		{
			Name:  aws.String("custom:ACCOUNT_ID"),
			Value: user.AccountID,
		},
		{
			Name:  aws.String("custom:STORE_ID"),
			Value: user.StoreID,
		},
	}
	return attrs
}
