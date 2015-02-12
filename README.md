# MadHacks2015
The MadHacks2015 main website


GET /
	Load Home page
	Data sent to renderer: 
		logged - user is logged in

GET /apply
	Load application page
	Data sent to renderer
		blank user - if user is not logged in
			or
		logged user - if is logged in
		(see /routes/index.js for object)

GET /login
	Load Login page
	(we can remove this)

GET /forgot
	load page to submit email

GET /users/forgot_req?email=
	checks for user 
	results
		bad data 200 success:false
		no email in db 200 success:false
		error 200 success:false
		email sent 200 success:true

GET /forgot/{token}
	comes from the email sent
	Loads page to submit new password

POST /forgot/:token/update
	body:
		password

POST /users/apply
	creates entry in db 
	body:
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
	result
		200 {success:true}
		200 {success:false}
		400 {success:false, error:error}

POST /users/update
	Same as apply except used to update an entry
	primary key is email

POST /users/anon
	Anonymous Survey
	body:
		state : ''
		age : ''
		degree : ''
		education : ''
		gender : ''
		ethnicity : ''
		parent_education : ''
		background : ''

POST /users/login
	body:
		email
		password
	redirects to /login on failure
	redirects to / on success
	<!-- try not to do ajax on this -->
