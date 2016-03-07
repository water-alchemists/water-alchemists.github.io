'use strict';
import EddiFireStarter from '../modules/eddi-firebase';
import CookieStoreMaker from '../modules/cookie-store';

import { hashHistory } from 'react-router';
import { PATHS } from '../constants';

import {
	USER_LOGIN_SUCCESS,
	USER_LOGIN_ERROR,
	USER_LOGOUT_SUCCESS,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_ERROR,
	USER_GETPROFILE_SUCCESS,
	USER_CREATE_ERROR
} from '../constants';

const EddiFire = EddiFireStarter(),
	EddiCookie = CookieStoreMaker();

function userLoginSuccess(user){
	return {
		type : USER_LOGIN_SUCCESS,
		user
	};
}

function userLoginError(error){
	return {
		export : USER_LOGIN_ERROR,
		error
	}
}

export function userLogoutSuccess(){
	return {
		type : USER_LOGOUT_SUCCESS
	};
}

function userUpdateSuccess(user){
	return {
		type : USER_UPDATE_SUCCESS,
		user
	};
}

function userUpdateError(user){
	return {
		type : USER_UPDATE_ERROR,
		user
	};
}

export function userGetProfile(user){
	return {
		type : USER_GETPROFILE_SUCCESS,
		user
	}
}

function userCreateError(error){
	return {
		type : USER_CREATE_ERROR,
		error
	};
}

export function userCreateThunk(user){

	return dispatch => {
		const { email, password } = user;
		return EddiFire.createUser({ email, password })
			.then(userSuccess => {
				console.log('this is the userSuccess', userSuccess);
				const id = userSuccess.uid;
				delete user.password;
				console.log('created a user', userSuccess);
				return EddiFire.createUserProfile(id, user)
					.then(userProfile => {
						dispatch(userGetProfile(userProfile));
						hashHistory.push(PATHS.HOME);
					});
			})
			.catch(err => dispatch(userCreateError(err)));
	}
}

export function userLoginWithPasswordThunk(email, password){
	return dispatch => {
		return EddiFire.authWithPassword(email, password)
			.then(user => {
				const { uid, token, expires } = user;

				//set the token to cookie
				EddiCookie.setCookie(token, expires);

				//gets the user profile
				return EddiFire.getUserProfile(uid)
					.then(userProfile => {
						dispatch(userGetProfile(userProfile));
						hashHistory.push(PATHS.HOME);
					});
			})
			.catch(err => dispatch(userLoginError(err)));
	}
}

export function userLoginWithTokenThunk(token){
	return dispatch => {
		return EddiFire.authWithToken(token)
			.then(user => {
				//gets the user profile
				const { uid } = user;

				return EddiFire.getUserProfile(uid)
					.then(userProfile => dispatch(userGetProfile(userProfile)));

			})
			.catch(err => dispatch(userLoginError(err)));
	}
}

export function userLogout(){
	return dispatch => {
		EddiFire.unauthenticate();
		EddiCookie.setCookie(null);
		//let store know of logout
		dispatch(userLogoutSuccess());
	}
}