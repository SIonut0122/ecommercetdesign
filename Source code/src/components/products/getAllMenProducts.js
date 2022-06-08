 import { client, q } from '../../fauna/db';

const getAllMenProducts = client.query(
  q.Paginate(
    q.Match(
      q.Ref('indexes/men_products')))
)
  .then((response) => {
    const menProdRef = response.data
    // create new query out of todo refs. 
    // https://docs.fauna.com/fauna/current/api/fql/
    const getAllMenProdDataQuery = menProdRef.map((ref) => {
      return q.Get(ref)
    })
    // query the refs
    return client.query(getAllMenProdDataQuery).then((data) => data)
  })
  .catch((error) => console.log('error', error.message))

export default getAllMenProducts;