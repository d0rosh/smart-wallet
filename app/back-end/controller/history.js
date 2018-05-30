const app = require('../configuration/app').app;
const db = require('../configuration/mysql');

app.get('/get_history', function(req, resp){
	if (req.query.month != 'all'){
		db.query(`select income._date as _data, income._sum as _sum, income._name as _type, sourse._name as sourse, income.category as category, income.notes as notes
		from income inner join sourse on income.sourse_id = sourse.id
		where income._user_id = '${req.session.user.id}' and month(income._date) = ${req.query.month} and year(income._date) = ${req.query.year} 
		union
		select outcome._date as _data, outcome._sum as _sum, outcome._name as _type, outcome.sourse as sourse, category._name as category, outcome.notes as notes
		from outcome inner join category on outcome.category_id = category.id
		where outcome._user_id = '${req.session.user.id}' and month(outcome._date) = ${req.query.month} and year(outcome._date) = ${req.query.year}`, function(err, res){
			if (err) {
				resp.sendStatus(400);
			} else {
				resp.status(200).json(res);
			};
		});
	} else {
		db.query(`select income._date as _data, income._sum as _sum, income._name as _type, sourse._name as sourse, income.category as category, income.notes as notes
		from income inner join sourse on income.sourse_id = sourse.id
		where income._user_id = '${req.session.user.id}'
		union
		select outcome._date as _data, outcome._sum as _sum, outcome._name as _type, outcome.sourse as sourse, category._name as category, outcome.notes as notes
		from outcome inner join category on outcome.category_id = category.id
		where outcome._user_id = '${req.session.user.id}'`, function(err, res){
			if (err) {
				resp.sendStatus(400);
			} else {
				resp.status(200).json(res);
			};
		});
	}
});