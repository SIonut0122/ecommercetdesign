import { client, q } from './db';
export function addProdToCart(props) {
	

  	client.query(
	  q.Update(
	    q.Ref(q.Collection('users'), props.id),
	    { data: { cart: props.cart !== undefined && !props.cart.length > 0 ? null : props.cart} },
	  )
	)
.then(() => {})
.catch((err) => console.log(err))
	 
}
