import { client, q } from './db';
export function addProdToWishlist(props) {
	

  	client.query(
	  q.Update(
	    q.Ref(q.Collection('users'), props.id),
	    { data: { wishlist: !props.wishlist.length > 0 ? null : props.wishlist} },
	  )
	)
.then(() => {})
.catch((err) => console.log(err))
	 
}
