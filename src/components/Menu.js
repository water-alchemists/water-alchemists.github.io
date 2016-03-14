'use strict';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { PATHS } from '../constants';

import style from '../less/Menu.less';

class Menu extends Component {

	constructor(props){
		super(props);
		this.state = {
			optionsOpen: false
		};
	}

	toggleMenu(){
		this.setState({
			optionsOpen: !this.state.optionsOpen
		});
	}

	_renderLoggedIn(){
		const { menu, eddis } = this.props,
			{ name='' } = menu,
			{ list, selected={} }  = eddis,
			query = {
				id : selected.id
			};

		let menuOptions;

		if( list instanceof Array && list.length ){
		  	menuOptions = [
				<Link to={PATHS.LIST}>Home</Link>,
				<Link to={{ pathname : PATHS.DASHBOARD, query }}>Dashboard</Link>,
				<Link to={{ pathname : PATHS.REPORT, query }}>Report</Link>,
				<Link to={ PATHS.SETTINGS }>Settings</Link>,
				<Link to={{ pathname : PATHS.TROUBLESHOOT, query }}>Troubleshoot</Link>,
		  	];
		}

		return (
			<header id="menu">
				<div className={"burger-menu" + (this.state.optionsOpen ? ' open' : '') }
					onClick={ () => this.toggleMenu() } >
					<div className="icon">☰</div>
					<div className='menu-options'>
						{ menuOptions }
						<a onClick={() => this.logoutHandler()}>Logout</a>
					</div>
				</div>
				<h1>{ name }</h1>
			</header>
		);
	}

	logoutHandler(){
		const { logout } = this.props;
		if(logout instanceof Function) logout();
	}

	render(){
		const { user } = this.props,
			isLoggedIn = !!user.email;

		if(isLoggedIn){
			return this._renderLoggedIn();
		} else {
			return null;
		}
	}
}

Menu.propTypes = {
	isOpen : PropTypes.bool.isRequired,
	logout : PropTypes.func.isRequired,
	user : PropTypes.shape({
		email : PropTypes.string
	}),
	eddis : PropTypes.shape({
		list : PropTypes.arrayOf(
			PropTypes.shape({
				id : PropTypes.string
			})
		),
		selected : PropTypes.shape({
			id : PropTypes.string
		})
	}), 
	menu : PropTypes.shape({
		name : PropTypes.string
	})
};

export default Menu;
