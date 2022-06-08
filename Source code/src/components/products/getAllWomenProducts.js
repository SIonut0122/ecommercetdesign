 import { client, q } from '../../fauna/db';

const getAllWomenProducts = client.query(
  q.Paginate(
    q.Match(
      q.Ref('indexes/women_products')))
)
  .then((response) => {
    const womenProdRef = response.data
    // create new query out of todo refs. 
    // https://docs.fauna.com/fauna/current/api/fql/
    const getAllWomenProdDataQuery = womenProdRef.map((ref) => {
      return q.Get(ref)
    })
    // query the refs
    return client.query(getAllWomenProdDataQuery).then((data) => data)
  })
  .catch((error) => console.log('error', error.message))

export default getAllWomenProducts;