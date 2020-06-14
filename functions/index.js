const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const cors = require('cors');
const corsHandler = cors({origin: true});


exports.getUsers = functions.https.onRequest((req, res) => {
	admin
	.firestore()
	.collection('users')
	.orderBy('createdAt','desc')
	.get()
	.then((data) => {
		let users = [];
		data.forEach((doc) => {
			users.push({
				userId: doc.id,
			 	name: doc.data().name,
			 	lastname: doc.data().lastname,
				createdAt: doc.data().createdAt
			});
		});
		return res.json(users);
	})
		.catch((err) => console.error(err));
})


exports.addUser = functions.https.onRequest((req,res) => {

      corsHandler(req, res, () => {
 

    	 const newUser = {
		 	name: 'CAAT PISAT',
		 	lastname: 'PULA-N MATA',
		 	createdAt: new Date().toISOString()
		 };

		 admin.firestore().collection('users').add(newUser)
		 .then((doc) => {
		 	console.log('User added success');
		 	res.json({ message: 'ALL GOOD'});
		 })
		 .catch((err) => {
		  	res.json({ message: 'NOOOT GOOD'});
		 	console.log(err);
		 });

    })
});

 