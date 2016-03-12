'use strict';
const Firebase = require('firebase');

const PATHS = {
	BASE_PATH : 'https://eddi.firebaseIO.com',
	USER_PATH : 'users',
	EDDI_PATH : 'eddis',
	METRIC_PATH : 'metrics',
	STATE_PATH : 'state',
	PIN_PATH : 'pins',
	SETTINGS_PATH : 'settings',
	SALINITY_PATH : 'salinity',
	TIMING_PATH : 'timing',
	NAME_PATH : 'name',
	VERSION_PATH : 'version',
	START_TIME : 'start',
	END_TIME : 'end',
	HOUR : 'hour',
	MINUTE : 'minute',
	TESTEDDI_PATH : 'test-eddi'
};

class EddiFire {
	constructor(){
		const ref = new Firebase(PATHS.BASE_PATH);

		this.refs = {
			BASE : ref,
			USER : ref.child(PATHS.USER_PATH),
			EDDI : ref.child(PATHS.EDDI_PATH)
		};
	}

	isAuthenticated(){
		return new Promise((resolve, reject) => {
			const user = this.refs.BASE.getAuth();
			if(!user) return reject(new Error('User is not authenticated.'));
			resolve(user);
		})
	}

	authWithToken(token){
		return new Promise((resolve, reject) => {
			this.refs.BASE.authWithCustomToken(token, (error, user) => {
				if(error) return reject(error);
				resolve(user);
			});
		});
	}

	authWithPassword(email, password){
		const submission = { email, password };
		return new Promise((resolve, reject) => {
			this.refs.BASE.authWithPassword(
				submission, 
				(error, user) => {
					if(error) return reject(error);
					resolve(user);
				}
			);
		})
	}

	unauthenticate(){
		return this.refs.BASE.unauth();
	}

	getUserProfile(id){
		return new Promise((resolve, reject) => {
			this.refs.USER.child(id).once('value', snapshot => {
				const user = snapshot.val();
				if(!user) return reject(new Error('Profile does not exist for this user.'));
				resolve(user);
			});
		});
	}

	createUser(email, password){
		const submission = { email, password };
		return new Promise((resolve, reject) => {
			this.refs.BASE.createUser(
				submission, 
				(error, user) => {
					if(error) return reject(error);
					resolve(user);
				}
			);
		});
	}

	createUserProfile(id, user){
		return new Promise((resolve, reject) => {
			this.refs.USER.child(id).set(
				user, 
				(error) => {
					if(error) return reject(error);
					const submission = {};
					submission[id] = user;
					resolve(submission);
				}
			);
		});
	}

	updateUserProfile(id, update){
		return new Promise((resolve, reject) => {
			this.refs.USER.child(id).update(update, (error) => {
				if(error) return reject(error);
				resolve();
			});
		});
	}

	getAllEddiByUser(userId){
		return new Promise((resolve, reject) => {
			this.refs.EDDI
				.orderByChild(PATHS.USER_PATH)
				.equalTo(userId)
				.once('value', data => {
					const eddiList = data.val() || [],
						eddiIdList = Object.keys(eddiList).map(key => {
							return eddiList[key];
						});
					resolve(eddiIdList);
				}, reject);
		});
	}

	findByEddi(id){
		return new Promise((resolve, reject) => {
			this.refs.EDDI.child(id).once('value',
				snapshot => {
					const eddi = snapshot.val();
					if(!eddi) return reject(new Error(`Eddi machine ${id} does not exist.`));
					resolve(eddi);
				}, reject);
		});
	}

	assignEddiToUser(userId, eddiId){
		return this.findByEddi(eddiId)
			.then(() => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(eddiId)
						.child(PATHS.USER_PATH)
						.set(
							userId, 
							error => {
								if(error) return reject(error);
								resolve();
							}
						);
					});
			});
	}

	unassignEddiToUser(userId, eddiId){
		return this.findByEddi(eddiId)
			.then(() => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(eddiId)
						.child(PATHS.USER_PATH)
						.set(
							null,
							error => {
								if(error) return reject(error);
								resolve();
							}
						);
		});
			});
	}

	isEddiOwner(eddiId){
		return this.isAuthenticated()
			.then(user => {
				const userId = user.uid;
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(eddiId)
						.child(PATHS.USER_PATH)
						.once('value', snapshot => {
							const data = snapshot && snapshot.val();
							if(data === userId) return resolve(userId);
							else reject(new Error('User is not the owner of this eddi.'));
						}, reject);
				});
			});
	}

	updateEddiSettings(eddiId, settings){
		return this.findByEddi(eddiId)
			.then(() => this.isEddiOwner(eddiId))
			.then(userId => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(eddiId)
						.child(PATHS.SETTINGS_PATH)
						.update(settings, error => {
							if(error) return reject(error);
							resolve({...settings});
						})
					});
			});
	}

	setName(eddiId, name){
		return this.findByEddi(eddiId)
			.then(() => this.isEddiOwner(eddiId))
			.then(userId => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(eddiId)
						.child(PATHS.SETTINGS_PATH)
						.child(PATHS.NAME_PATH)
						.update(
							name,
							error => {
								if(error) return reject(error);
								resolve();
							}
						);
				})
			})
	}


	setSalinity(id, salinity){
		return this.findByEddi(id)
			.then(() => this.isEddiOwner(id))
			.then(() => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(id)
						.child(PATHS.SETTINGS_PATH)
						.child(PATHS.SALINITY_PATH)
						.set(
							salinity, 
							error => {
								if(error) return reject(error);
								resolve({ id, settings : { salinity } });
							}
						);
				});
			});
	}

	updateStartTime(id, { hour, minute }){
		const start = { hour, minute };
		return this.findByEddi(id)
			.then(() => this.isEddiOwner(id))
			.then(() => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(id)
						.child(PATHS.SETTINGS_PATH)
						.child(PATHS.TIMING_PATH)
						.child(PATHS.START_TIME)
						.update(
							start,
							error => {
								if(error) return reject(error);
								resolve({ 
									id, 
									timing : { 
										hour, 
										minute 
									} 
								});
							}
						)
				})
			})
	}

	setEndTime(id, { hour, minute }){
		const end = { hour, minute };
		return this.findByEddi(id)
			.then(() => this.isEddiOwner(id))
			.then(() => {
				return new Promise((resolve, reject) => {
					this.refs.EDDI.child(id)
						.child(PATHS.SETTINGS_PATH)
						.child(PATHS.TIMING_PATH)
						.child(PATHS.END_TIME)
						.update(
							end,
							error => {
								if(error) return reject(error);
								resolve({
									id,
									timing : {
										hour, 
										minute
									}
								});
							}
						);
				})
			});	
	}

}


export default function(){
	let init;
	if(init) return init;
	else {
		init = new EddiFire();
		return init;
	}
}