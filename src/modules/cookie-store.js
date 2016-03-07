'use strict';
function parseCookie(cookieString){
	const sections = cookieString.split(';').map(section => section.split('='));
	return sections.reduce((cookie, section) => {
		cookie[section[0]] = section[1];
		return cookie;
	}, {});
}

function formatCookie(token, expires){
	return `token=${token};expires=${expires};`;
}

class CookieStore {
	constructor(){
		this.cookie = null;
	}

	setCookie(token, expires){
		console.log('i am setting myself');
		//sets the cookie
		if(token) {
			document.cookie = formatCookie(token, expires);
			this.cookie = {
				token,
				expires
			};
		}
		else document.cookie = this.cookie = null;
	}

	getCookie(){
		if(!this.cookie && document.cookie) this.cookie = parseCookie(document.cookie);
		return this.cookie;
	}
}

export default function(){
	let init;
	if(init) return init;
	else {
		init = new CookieStore();
		return init;
	}
};