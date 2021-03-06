'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import { PATHS } from '../../constants';

import HomeButton from '../../components/HomeButton';
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm';

import { getAllEddiByUserThunk } from '../../actions/eddis';
import { userLoginWithPasswordThunk, userCreateThunk } from '../../actions/user';

import style from './Home.less';




const Modes = {
	BASE: 0,
	LOGIN: 1,
	SIGNUP: 2,
};

const ROUTES = {
	LOGIN : { pathname : PATHS.HOME, query : { view : 'login' } },
	SIGNUP : { pathname : PATHS.HOME, query : { view : 'signup' } }
}

function mapStateToProps(state){
	return {
		user : state.user,
		eddis : state.eddis.list
	};
}

function mapDispatchToProps(dispatch){
	return {
		navigateTo: (pathname, query) => browserHistory.push({ pathname, query }),
		login: ({ email, password }) => dispatch(userLoginWithPasswordThunk(email, password)),
		signup: (user) => dispatch(userCreateThunk(user)),
	};
}





class Home extends Component {
	constructor(props, context){
		super(props, context);
		const { router } = this.context;

		let mode;
		if(router.isActive(ROUTES.LOGIN)) mode = Modes.LOGIN;
		else if(router.isActive(ROUTES.SIGNUP)) mode = Modes.SIGNUP;
		else mode = Modes.BASE;
		
		this.state = {
			mode
		};
	}

	componentWillReceiveProps(nextProps){

		if(nextProps.user.email ){
			// user is logged in. go directly to list screen
			browserHistory.replace(PATHS.LIST);
		}

		const { router } = this.context;
		let mode;
		if(router.isActive(ROUTES.LOGIN)) mode = Modes.LOGIN;
		else if(router.isActive(ROUTES.SIGNUP)) mode = Modes.SIGNUP;
		else mode = Modes.BASE;
		this.setState({ mode });
	}

	navigateTo(key){
		const destination = PATHS[key];
		if(destination) return browserHistory.push(destination);
	}

	_renderBase(){
		return [
			(<div className='auth-button'
				onClick={ () => browserHistory.push(ROUTES.LOGIN)}
			>
				Login ›
			</div>),
			(<div className='auth-button'
				onClick={ () => browserHistory.push(ROUTES.SIGNUP)}
				>
				Sign Up ›
			</div>)
		];
	}

	_renderLogin(){
		return <LoginForm onSubmit={this.props.login} />;
	}

	_renderSignup(){
		return <SignupForm onSubmit={this.props.signup} />;
	}


	render(){
		var modeContent;
		switch(this.state.mode){
			case Modes.BASE:
				modeContent = this._renderBase();
				break;
			case Modes.LOGIN:
				modeContent = this._renderLogin();
				break;
			case Modes.SIGNUP:
				modeContent = this._renderSignup();
				break;
			default:
				return null;
		}

		return (
			<div id="home" className="page dark">
				<div className="content" >
					<div className="logo-container">
						<img src='/assets/logo.png' />
					</div>
					{ modeContent }
				</div>
			</div>
		);
	}
}


Home.propTypes = {
	eddis : PropTypes.arrayOf(
		PropTypes.shape({
			name : PropTypes.string
		})
	)
};

Home.contextTypes = {
	router : PropTypes.object.isRequired
};


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
