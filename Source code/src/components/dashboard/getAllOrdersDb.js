 import { client, q } from '../../fauna/db';

const getAllOrdersDb = client.query(
  q.Paginate(
    q.Match(
      q.Ref('indexes/active_orders')))
)
  .then((response) => {
    const activeOrders = response.data
    // create new query out of todo refs. 
    // https://docs.fauna.com/fauna/current/api/fql/
    const getAllActiveOrdersDataQuery = activeOrders.map((ref) => {
      return q.Get(ref)
    })
    // query the refs
    return client.query(getAllActiveOrdersDataQuery).then((data) => data)
  })
  .catch((error) => console.log('error', error.message))

export default getAllOrdersDb;