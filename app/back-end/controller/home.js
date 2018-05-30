const app = require('../configuration/app').app;
const db = require('../configuration/mysql');
const preAuth = require('../configuration/middleware').preAuth;

app.get('/board', preAuth,function(req, resp){
    var data = {};
    
    db.query(`SELECT sum(_sum) as _sum FROM saves WHERE _user_id = '${req.session.user.id}'`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            data.total_budget = res[0]._sum;

            db.query(`SELECT sum(_sum) as _sum FROM income WHERE _user_id = '${req.session.user.id}' AND MONTH(_date) = ${req.query.month} AND YEAR(_date) = ${req.query.year}`, function(err, res){
                if (err) {
                    resp.sendStatus(400);
                }else {
                    data.this_month_income = res[0]._sum;
                    
                    db.query(`SELECT sum(_sum) as _sum FROM outcome WHERE _user_id = '${req.session.user.id}' AND MONTH(_date) = ${req.query.month} AND YEAR(_date) = ${req.query.year}`, function(err, res){
                        if (err) {
                            resp.sendStatus(400);
                        }else {
                            data.this_month_outcome = res[0]._sum;
                            resp.status(200).json(data);
                        }
                    });
                }
            });
        }
    });
});

app.get('/get_home', function(req, resp){
    var data = {};
    
    db.query(`SELECT saves.id, _name, _sum, src FROM saves LEFT JOIN icons on saves.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        } else {
            data.saves = res;
            
            db.query(`SELECT * FROM sourse WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
                if (err) {
                    resp.sendStatus(400);
                } else {
                    data.sourse = res;
                    
                    db.query(`SELECT category.id, _name, src FROM category LEFT JOIN icons on category.icon_id = icons.id WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
                       if (err) {
                           resp.sendStatus(400);
                       } else {
                           data.category = res;
                           resp.status(200).json(data);
                       }
                    });
                }
            });
        }
    });
});

app.get('/get_saves_home', function(req, resp){
    db.query(`SELECT * FROM saves WHERE _user_id = '${req.session.user.id}' AND active = 1`, function(err, res){
        if (err) {
            resp.sendStatus(400);
        }else {
            resp.status(200).json(res);
        }
    });
});

app.get('/get_outcome_home', function(req, resp){
    db.query(`SELECT _sum, category_id FROM outcome WHERE _user_id = '${req.session.user.id}' AND MONTH(outcome._date) = ${req.query.month} AND YEAR(outcome._date) = ${req.query.year}`, function(err, res){
        if(err){
            resp.sendStatus(400);
        }else {
            resp.status(200).json(res);
        }
    })
});


app.post('/add_incomes', function(req, resp){
   db.query(`INSERT INTO income (_user_id, saves_id, sourse_id, notes, _sum) VALUES ('${req.session.user.id}', '${req.body.save_id}', '${req.body.sourse_id}', '${req.body.notes}', '${req.body.money}')`, function(err, res){
        if (err) {
            console.log(err)
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }   
   }); 
});


app.post('/add_outcomes', function(req, resp){
   db.query(`INSERT INTO outcome (_user_id, saves_id, category_id, notes, _sum) VALUES ('${req.session.user.id}', '${req.body.saves_id}', '${req.body.category_id}', '${req.body.notes}', '${req.body._sum}')`, function(err, res){
        if (err) {
            console.log(err)
            resp.sendStatus(400);
        }else {
            resp.sendStatus(204);
        }   
   }); 
});