const app = require('../configuration/app').app;
const db = require('../configuration/mysql');

app.get('/get_profile', function(req, resp){
    var data = {};
    db.query(`SELECT * FROM _profile WHERE _user_id = '${req.session.user.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            data.user = res;
            db.query(`SELECT * FROM sourse WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
                if (err){
                    resp.sendStatus(400);
                }else {
                    data.sourse = res;
                    db.query(`SELECT category.id, _name, src FROM category LEFT JOIN icons on category.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
                        if (err){
                            resp.sendStatus(400);
                        }else {
                            data.category = res;
                            db.query(`SELECT saves.id, _name, src, _sum FROM saves LEFT JOIN icons on saves.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
                                if (err){
                                    resp.sendStatus(400);
                                }else {
                                    data.saves = res;
									db.query(`SELECT * FROM icons`, function(err, res){
										if (err){
											resp.sendStatus(400);
										}else {
											data.icons = res;
											resp.status(200).json(data);
										}
									});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get('/get_user', function(req, resp){
    db.query(`SELECT img FROM _profile WHERE _user_id = '${req.session.user.id}'`, function(err, res){
        if(err){
            resp.sendStatus(400);
        }else {
            resp.status(200).json(res);
        }
    });
});

app.put('/update_profile', function(req, resp){
    db.query(`UPDATE _profile SET first_name = '${req.body.fname}', last_name = '${req.body.lname}', age = '${req.body.age}' WHERE _user_id = '${req.session.user.id}'`, function(err, res){
        if (err) {
            console.log(err)
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/update_photo', function(req, resp){
    db.query(`UPDATE _profile SET img = '${req.body.img.base64}' WHERE _user_id = '${req.session.user.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.delete('/delete_user', function(req, resp){
    db.query(`DELETE FROM _user WHERE id = '${req.session.user.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            req.session.cookie.expires = '2000-12-17T23:44:26.305Z';
            resp.clearCookie('user_sid');
            resp.sendStatus(204);
        }
    });
});



app.post('/create_sourse', function(req, resp){
    db.query(`INSERT INTO sourse (_user_id, _name) VALUES ('${req.session.user.id}', '${req.body._name}')`, function(err, res){
        if (err) {
            console.log(err)
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/delete_sourse', function(req, resp){
    db.query(`UPDATE sourse SET active = 0 WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/update_sourse', function(req, resp){
    db.query(`UPDATE sourse SET _name = '${req.body._name}' WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});


app.post('/create_category', function(req, resp){
    db.query(`INSERT INTO category (_user_id, _name) VALUES ('${req.session.user.id}', '${req.body._name}')`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/delete_category', function(req, resp){
    db.query(`UPDATE category SET active = 0 WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/update_category', function(req, resp){
    db.query(`UPDATE category SET _name = '${req.body._name}' WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});


app.post('/create_saves', function(req, resp){
    db.query(`INSERT INTO saves (_user_id, _name, _sum) VALUES ('${req.session.user.id}', '${req.body._name}', '0')`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.put('/delete_saves', function(req, resp){
    db.query(`UPDATE saves SET active = 0, _sum = 0 WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.delete_id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            db.query(`UPDATE saves SET _sum = _sum + '${req.body._sum}' WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
                if (err) {
                    resp.sendStatus(400);
                }else {
                    resp.sendStatus(204);
                }
            });
        }
    });
});

app.put('/update_saves', function(req, resp){
    db.query(`UPDATE saves SET _name = '${req.body._name}' WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});

app.get('/get_table', function(req, resp){
	if(req.query.field == 'sourse'){
		db.query(`SELECT * FROM sourse WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
			if (err){
				resp.sendStatus(400);
			}else {
				resp.status(200).json(res);
			}
		});
	} else if (req.query.field == 'category'){
		db.query(`SELECT category.id, _name, src FROM category LEFT JOIN icons on category.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
			if (err){
				resp.sendStatus(400);
			}else {
				resp.status(200).json(res);
			}
		});
	} else {
		db.query(`SELECT saves.id, _name, src, _sum FROM saves LEFT JOIN icons on saves.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
			if (err){
				resp.sendStatus(400);
			}else {
				resp.status(200).json(res);
			}
		});
	}
});

app.get('/get_sum', function(req, resp){
    db.query(`SELECT _sum FROM saves WHERE _user_id = '${req.session.user.id}' AND id = '${req.query.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.status(200).json(res);
        }   
    });
});

app.put('/edit_icon', function(req, resp){
	db.query(`UPDATE ${req.body.field} SET icon_id = '${req.body.id_icon}' WHERE _user_id = '${req.session.user.id}' AND id = '${req.body.id_field}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }
    });
});
