'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state){
	return {
		eddi : state.eddis.eddi
	};
}

function mapDispatchToProps(dispatch){
	return {
	};
}

class Report extends Component {
	render(){
		const { eddi } = this.props;
		return (
			<div id="report" className='page'>
				{'This is the report page.'}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Report);
