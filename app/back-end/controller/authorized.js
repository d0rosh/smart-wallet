const app = require('../configuration/app').app;
const db = require('../configuration/mysql');
const preAuth = require('../configuration/middleware').preAuth;
const bcrypt = require('../configuration/middleware').bcrypt;

app.post('/current/user', preAuth, function(req, resp){
    resp.json(req.session.user);
});

app.post('/current/user/destroy', function(req,resp){

    req.session.cookie.expires = '2000-12-17T23:44:26.305Z';
    resp.clearCookie('user_sid');
    resp.sendStatus(204);
});

app.post('/signin', function(req, resp){
	req.checkBody('username', 'Username or Password is not Valid!').isAuthorized(req);

	req.asyncValidationErrors().then(
		success=>{
			resp.sendStatus(204);
		},
		error=>{
			resp.status(400).json(error);
		}
	)
});

app.post('/registration', function(req, resp){
	req.checkBody('username', 'Username is exist').existValue('username');
	req.checkBody('username', 'Username is empty').notEmpty();
	req.checkBody('username', 'Username must be between 5-20 characters long').len(5, 20);
	req.checkBody('email', 'Email is not Valid').isEmail();
	req.checkBody('email', 'Email is exist').existValue('email');
	req.checkBody('password', 'Password must be between 8-100 characters long').len(5, 16);
	req.checkBody('rppassword', 'Passwords do not match, please try again.').equals(req.body.password);


	req.asyncValidationErrors().then(
		success=>{
			bcrypt.hash(req.body.password, 10)
			.then(  
				res=>{
				    req.body.password = res;
				    db.query(`INSERT INTO _user (username, _password, email) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.email}')`, function(err, res){
				        if (err) {
				            resp.status(400).json(err);
				        }else {     
				        	db.query(`SELECT * FROM _user WHERE username = '${req.body.username}'`, function(err,res){
				        		if (err){
				        			resp.sendStatus(400);
				        		} else {
				        			const user = res[0];
					        		req.session.user = user;
									resp.sendStatus(204);
				        		}
				        	}); 
				        }   
				    });  
				},
			 	err=>console.log(err)
			)
		},
		error=>{
			resp.status(400).json(error);
		}
	)
});
 