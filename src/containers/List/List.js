'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { PATHS } from '../../constants';

import EddiListItem from '../../components/EddiListItem';
import AddEddiButton from '../../components/AddEddiButton';

import { getAllEddiByUserThunk } from '../../actions/eddis';
import { menuNameChange } from '../../actions/menu';

import style from './List.less';


function mapStateToProps(state){
	return {
		user : state.user,
		eddis : state.eddis.list
	};
}

function mapDispatchToProps(dispatch){
	return {
		navigateTo : (pathname, query) => browserHistory.push({ pathname, query }),
		getEddisByUser: () => dispatch(getAllEddiByUserThunk()),
		menuName: (name) => dispatch(menuNameChange(name)),
	};
}

class List extends Component {

	constructor(props){
		super(props);
		this.state = {};
		props.menuName("My Eddis");
	}

	componentWillMount(){
		const { user, getEddisByUser } = this.props;
		if(user) return getEddisByUser();
	}

	componentWillReceiveProps(nextProps){
		const { user, getEddisByUser } = this.props;
		if(nextProps.user !== user) return getEddisByUser();
	}

	clickHandler(destination, query){
		const { navigateTo } = this.props;
		navigateTo(destination, query);
	}

  	navigateTo(key, query = {}){
		const pathname = PATHS[key],
			destination = {
				pathname,
				query
			};

		if(pathname) return browserHistory.push(destination);
	}

	_renderEddis(){
		const { eddis } = this.props;
		if(eddis) {
			return eddis.map((eddi, i) => <EddiListItem key={eddi.id} eddi={eddi} />);
		}
	}

	_renderNoEddis(){
		return <div className='eddis-empty'>
			<p> Currently you are not tracking any eddis. </p>
			<AddEddiButton />
		</div>;
	}

	render(){
		const { user, eddis } = this.props;

		var showEddi;
		if( eddis && eddis.length ){
			showEddi = this._renderEddis();
			console.log('these are teh eddis', eddis);
		} else {
			showEddi = this._renderNoEddis();
		}

		return (
			<div id="list" className="page">
				{ showEddi }
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(List);
