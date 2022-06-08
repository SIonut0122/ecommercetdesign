
const faunadb = require('faunadb'); 
const q       = faunadb.query
 
  var client  = new faunadb.Client({
    secret: process.env.REACT_APP_FBD_KEY,
    domain: 'db.fauna.com',
    scheme: 'https',
  })
 
export { q, client } 