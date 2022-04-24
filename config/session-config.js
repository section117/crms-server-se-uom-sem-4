const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

let sessionMiddleware;

const getExpressSessionStore = () => {
	if(!sessionMiddleware) {
		let session_config = {
			secret: process.env.SESSION_SECRET,
			cookie: {
				sameSite: 'lax',
			},
			resave: false,
			saveUninitialized: false
		};
		if (process.env.NODE_ENV === 'production'){
			session_config.cookie.secure = true;
		} else if (process.env.NODE_ENV === 'development'){
			//Set Session Store to MongoDBStore instead of MemoryStore
			session_config.store = new MongoDBStore({
				uri: process.env.DB_CONNECTION_STRING,
				collection: 'sessions'
			}, (error) => {
				if (error){
					console.log(error);
				}
			});
		}
		sessionMiddleware = session(session_config);
	}

	return sessionMiddleware;
};

exports.getExpressSessionStore = getExpressSessionStore;