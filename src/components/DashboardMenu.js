'use strict';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';


import { PATHS, QUERY } from '../constants';

const ACTIVE_CLASS = 'active';

class DashboardMenu extends Component {
	render(){
		const { id, view, salinityIn, salinityOut, flow, power } = this.props,
			defaultViewClass = classNames({ [ACTIVE_CLASS] : !view }), //handles appearance of default tab
			salinityInClass = classNames([
				'sprite', 
				'salinityIn', 
				{ faded : view !== QUERY.SALINITY_IN },
				{ bad : !salinityIn }
			]),
			salinityInFont = classNames({ 'red-font' : !salinityIn }),
			salinityOutClass = classNames([
				'sprite', 
				'salinityOut', 
				{ faded : view && view !== QUERY.SALINITY_OUT },
				{ bad : !salinityOut }
			]),
			salinityOutFont = classNames({ 'red-font' : !salinityOut }),
			flowClass = classNames([
				'sprite', 
				'flow', 
				{ faded : view !== QUERY.FLOW },
				{ bad : !flow }
			]),
			flowFont = classNames({ 'red-font' : !flow }),
			powerClass = classNames([
				'sprite', 
				'power', 
				{ faded : view !== QUERY.POWER },
				{ bad : !power }
			]),
			powerFont = classNames({ 'red-font' : !power });		

 		return (
			<div className='dashboard-menu'>
				<Link to={ {pathname : PATHS.DASHBOARD, query : { id, view : QUERY.SALINITY_IN }} }
							activeClassName={ACTIVE_CLASS}>
					<div className={salinityInClass} />
					<p className={salinityInFont}>in</p>
				</Link>
				<Link to={ {pathname : PATHS.DASHBOARD, query : { id, view : QUERY.SALINITY_OUT }} }
							activeClassName={ACTIVE_CLASS}
					className={defaultViewClass}>
					<div className={salinityOutClass} />
					<p className={salinityOutFont}>out</p>
				</Link>
				<Link to={ {pathname : PATHS.DASHBOARD, query : { id, view : QUERY.FLOW }} }
							activeClassName={ACTIVE_CLASS}>
					<div className={flowClass} />
					<p className={flowFont}>flow</p>
				</Link>
				<Link to={ {pathname : PATHS.DASHBOARD, query : { id, view : QUERY.POWER }} }
							activeClassName={ACTIVE_CLASS}>
					<div className={powerClass} />							
					<p className={powerFont}>power</p>
				</Link>
			</div>
		);
	}
}

DashboardMenu.propTypes = {
	id : PropTypes.string,
	view : PropTypes.string,
	current : PropTypes.string,
	salinityIn : PropTypes.bool,
	salinityOut : PropTypes.bool,
	flow : PropTypes.bool,
	power : PropTypes.bool
};


export default DashboardMenu;
