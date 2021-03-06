var User 		= require("../../models/user"),
	debug		= require('debug')('opensearch')
;

module.exports = {

	login_form: function(req, res) {  
		var host 		= req.protocol + "://"+ req.get('Host')
		res.render ("firebase/login.ejs", {
			layout: null,
			host: host,
			title: "Login"
		})
	},
	
	logout: function(req, res) {  
		res.render ("firebase/logout.ejs", {
			layout: null,
			title: "Logout"
		})
	},
	
	signin: function(req,res) {
		res.render ("firebase/signin.ejs", {
			layout: null,
			title: "signin"
		})
	},
	
	verify: function(req, res) {
		var loggeduser = req.body
		debug("firebase verify", JSON.stringify(loggeduser))
		
		if( (loggeduser.email == undefined) || (loggeduser.email == null) ) {
			console.log("Not email - No login")
			return res.sendStatus(400)
		}
		
		if( (loggeduser == undefined) || (Object.keys(loggeduser).length==0 )) return res.sendStatus(400)
			
		User.get_by_email(loggeduser.email, function(err, user) {
			if( !err && user) {
				debug("Found user by email...")
				user.updated_at = new Date()
				user.gravatar 	= loggeduser.photoURL
				User.update(user, function(err, user) {					
					req.session.user = user
					res.sendStatus(200)				
				})
			} else {
				// new user
				debug("Creating New user...")
				var json = {
					name: 	loggeduser.email,
					email: 	loggeduser.email,
					organization: 'TBD',
					created_at: new Date(),
					updated_at: new Date(),
					gravatar: loggeduser.photoURL
				}

				User.save(json, function(err, user) {
					if (!err) {
						req.session.user = user
						res.sendStatus(200)				
					}
				})
			}
		})
	}
}
