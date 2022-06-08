import { client, q } from './db'

const getAllUsers = client.query(
  q.Paginate(
    q.Match(
      q.Ref('indexes/all_users')))
)
  .then((response) => {
    const usersRefs = response.data
    // create new query out of todo refs. 
    // https://docs.fauna.com/fauna/current/api/fql/
    const getAllUsersDataQuery = usersRefs.map((ref) => {
      return q.Get(ref)
    })
    // query the refs
    return client.query(getAllUsersDataQuery).then((data) => data)
  })
  .catch((error) => console.log('error', error.message))

export default getAllUsers;