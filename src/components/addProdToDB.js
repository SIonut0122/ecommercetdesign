
 import { client, q } from '../fauna/db';


export function addProdToDB(props) {
	

  	client.query(
	  q.Update(
	    q.Ref(q.Collection('users'), props.id),
	    { data: { cart: !props.cart.length > 0 ? null : props.cart} },
	  )
	)
.then((ret) => console.log('Productinfo: add/remove product cart'))
	 
}
