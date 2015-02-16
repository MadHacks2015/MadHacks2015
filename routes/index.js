var express = require('express');
var router = express.Router();

var blankUser = { 
	firstname: '',
	lastname: '',
	email: '',
	password: '',
	swag_size: '',
	is_18: 'false',
	attend_school: 'true',
	school: '',
	state: '',
	country: '',
	city: '',
	zip: '',
	travel: 'false',
	venmo: '',
	food_vegetarian: 'false',
	food_vegan: 'false',
	food_glutenfree: 'false',
	food_pescetarian: 'false',
	food_dairyfree: 'false',
	food_kosher: 'false',
	food_halal: 'false',
	food_other: '',
	Github: '',
	linkedIn: '',
	Dribble: '',
	resume: 'Select Resume',
	exposure: '',
	plan_hardware: 'false',
	plan_hardware_on: '',
	plan_mentee: 'false',
	plan_mentor: 'false',
	need_partner: 'false',
	plan_need_partner_skills: '',
    plan_known_partners: '',
	update:'false'
}

/* GET home page. */
router.get('/', function(req, res) {
	if(req.signedCookies.user == undefined)
		res.render('page_index', { title: 'Madhacks', logged:'false' });
	else		
		res.render('page_index', { title: 'Madhacks', logged:'true' });
});

router.get('/apply', function(req, res) {
	global.sqler.getUser(req, function(err, user){
		if(err || user == undefined){
			res.render('page_application', blankUser);
		}else{
			user.update = 'true';
			console.log("old", user);
			res.render('page_application', user);
		}
	});
});

router.get('/login', function(req, res) {
	res.render('page_login', {tittle: 'Apply'});
});

router.get('/logout', function(req, res) {
	res.clearCookie('user');
	res.redirect("/");
});

router.get('/forgot', function(req, res) {
	res.render('page_forgot_pass_req', {});
});
router.get('/forgot/:token', function(req, res){
	console.log(req.params.token)
	db.get("SELECT * FROM pass_recovery WHERE token='"+req.params.token+"';", function(err, token){
		if(!err && token != undefined)
			res.render('page_forgot_pass_res', {token:req.params.token})
		else
			res.redirect("/forgot");
	});
});


router.post('/forgot/:token/update', function(req, res){
	if(req.body.password != undefined)
		db.get("SELECT * FROM pass_recovery WHERE token='"+req.params.token+"';", function(err, token){
			if(!err && token != undefined){
				var hash = global.bcrypt.hashSync(req.body.password);
				db.run("UPDATE applications SET password='"+hash+"' WHERE email='"+token.email+"';", function(err){
					if(err)
						res.redirect("/forgot/"+req.params.token);
					db.run("DELETE FROM pass_recovery WHERE token='"+req.params.token+"';", function(){
						db.redirect("/");
					});
				})
				res.render('page_forgot_pass_res', {token:req.params.token})
			}
			else
				res.redirect("/forgot");
		});
	else
		res.redirect("/forgot/"+req.params.token);
});

module.exports = router;

