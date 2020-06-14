
const faunadb = require('faunadb');

 

const q = faunadb.query
 
  var client = new faunadb.Client({
    secret: process.env.REACT_APP_FBD_KEY,
    domain: 'db.fauna.com',
    scheme: 'https',
  })
  client.query(
    q.ToDate('2018-06-06')
  )
  .then(function (res) { console.log('Result:', res) })
  .catch(function (err) { console.log('Error:', err) })

export { q, client } 