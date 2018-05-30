const app = require('../configuration/app').app;
const db = require('../configuration/mysql');

app.get('/all_statistics', function(req, resp){
	
	var data = {};
	
	db.query(`select _name, id from sourse where _user_id = ${req.session.user.id}`, function(err, res){
		if (err) {
			resp.sendStatus(400);
		} else {
			data.sourse = res;

			db.query(`select _name, id from category where _user_id = ${req.session.user.id}`, function(err, res){
				if (err) {
					resp.sendStatus(400);
				} else {
					data.category = res;

					db.query(`select _name, id, _sum from saves where _user_id = ${req.session.user.id} and active = true`, function(err, res){
						if (err) {
							resp.sendStatus(400);
						} else {
							data.saves = res;
							resp.status(200).json(data);
						};
					});
				};
			});
		};
	});
});

app.get('/statistics', function(req, resp){

    var data = {};
    
    if (req.query.month != 'all'){
		db.query(`select _sum, sourse_id, saves_id from income where _user_id = ${req.session.user.id} and month(_date) = ${req.query.month} and year(_date) = ${req.query.year}`, function(err, res){
			if (err) {
				resp.sendStatus(400);
			} else {
				data.income = res;
				
				db.query(`select _sum, category_id, saves_id from outcome where _user_id = ${req.session.user.id} and month(_date) = ${req.query.month} and year(_date) = ${req.query.year}`, function(err, res){
					if (err) {
						resp.sendStatus(400);
					} else {
						data.outcome = res;
						resp.status(200).json(data);
					};
				});
			};
		});
	} else {
		db.query(`select _sum, sourse_id, saves_id from income where _user_id = ${req.session.user.id}`, function(err, res){
			if (err) {
				resp.sendStatus(400);
			} else {
				data.income = res;
				
				db.query(`select _sum, category_id, saves_id from outcome where _user_id = ${req.session.user.id}`, function(err, res){
					if (err) {
						resp.sendStatus(400);
					} else {
						data.outcome = res;
						resp.status(200).json(data);
					};
				});
			};
		});
	}
});