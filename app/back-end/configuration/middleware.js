const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('./app');
const db = require('./mysql');

const app = config.app;
const express = config.express;
app.use(express.static('app/front-end'));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap'));
app.use(express.static('node_modules/font-awesome'));
app.use(express.static('node_modules/angular-base64-upload'));
app.use(express.static('node_modules/angular-animate'));
app.use(express.static('node_modules/angular-messages'));
app.use(express.static('node_modules/highcharts'));
app.use(express.static('node_modules/highcharts-exporting'));
app.use(express.static('node_modules/angular-css'));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

app.use(cookieParser());
app.use(expressValidator({
  customValidators: {
    existValue(value, field) {
    	return new Promise((resolve, reject) => {
       		db.query(`SELECT * FROM _user WHERE ${field} = '${value}'`, (err,res) => {
       			if (err) throw err;
	            if(res[0] == null) {
	              resolve();
	            } else {
	              reject();
	            }
       		})
       	});
    },
    isAuthorized(username, req) {
    	return new Promise((resolve, reject) => {
    		db.query(`SELECT * FROM _user WHERE username = '${username}'`, (err,res) => {
       			if (err) throw err;
	            if(res[0] == null) {
	            	reject();
	            } else {
	              	const user = res[0];
					bcrypt.compare(req.body.password, user._password).then(
						res=>{
							if (res) {
								req.session.user = user;
								resolve();
							}else {
								reject();
							}
						},
						err=>{
							reject();
						}
					)
	            }
       		})
    	});
    }
  }
}));
app.use(session({
    key: 'user_sid',
    secret: 'jgchgfgxxfdx',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));


app.use((req, resp, next) => {
    if (req.cookies && req.cookies.user_sid && !req.session.user) {
        resp.clearCookie('user_sid');
    }

    next();
});



var preAuth = function(req, resp, next){
    if(req.session && req.session.user){
        return next();
    }else{
        return resp.sendStatus(401);
    }
}


module.exports = {
    preAuth,
    bcrypt
};