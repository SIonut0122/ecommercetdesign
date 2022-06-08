 import { client, q } from '../../fauna/db';

const getAllChildrenProducts = client.query(
  q.Paginate(
    q.Match(
      q.Ref('indexes/children_products')))
)
  .then((response) => {
    const childrenProdRef = response.data
    // create new query out of todo refs. 
    // https://docs.fauna.com/fauna/current/api/fql/
    const getAllChildrenProdDataQuery = childrenProdRef.map((ref) => {
      return q.Get(ref)
    })
    // query the refs
    return client.query(getAllChildrenProdDataQuery).then((data) => data)
  })
  .catch((error) => console.log('Error while trying to fetch all children data', error.message))

export default getAllChildrenProducts;