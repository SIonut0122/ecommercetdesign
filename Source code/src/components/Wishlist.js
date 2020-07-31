import   React               from 'react';
import { Link              } from 'react-router-dom';
import { setWishList 	   } from '../actions';
import { connect           } from "react-redux";
import { addProdToWishlist } from '../fauna/addProdToWishlist';
import { addProdToCart     } from '../fauna/addProdToCart';
import '../css/Wishlist.css';


const mapStateToProps = state => {
  return {  
  		  wishList       : state.wishList,
  		  userDbInfo     : state.userDbInfo,
  		  userIsSignedIn : state.userIsSignedIn,
  		  cart           : state.cart
        };
};


function mapDispatchToProps(dispatch) {
  return { setWishList : products => dispatch(setWishList(products)) };
}


class connectedWishlist extends React.Component {



componentDidMount() {
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}

removeFromWishlistBtn(e,id) {
	// Opacity 0.6 for clicked product / disable call to action from product
	e.target.parentElement.setAttribute('style','opacity:0.6;pointer-events:none;');
	// Restore default style after 500 milisec
	setTimeout(() => {
		// Remove style /\ from all the wishbox products
		  // Because e.target is not triggered anymore, remove style from all products to restore default style
		let wishboxes = document.querySelectorAll('.wish_product_box');
			wishboxes.forEach((wbox) => wbox.removeAttribute('style'));
		// Remove product from wishlist
		let wishList      = [...this.props.wishList],
			cart          = [...this.props.cart],
			removeProduct = wishList.filter((prod) => prod.id !== id);
			// Set new props wishlist to be displayed
			this.props.setWishList({ wishList: removeProduct })	

			// Map through cart and change to false 'addedtowishlistfromcart' prop to false
			for(let c in cart) {
				if(cart[c].id === id) {
					cart[c].addedToWishlistFromCart = false;
				}
			}
			// If user is signed in, send wishlist to userDb info
			if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
			    // Update database's wishlist and cart
				let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist : removeProduct},
				    updatedCart     = {id: this.props.userDbInfo.ref.value.id, cart     : cart};
	 			    // Update cart to set 'addtowishfromcart' to false
	 			    addProdToCart(updatedCart);
				    // Call function to update userDb  is user is signed in
				    addProdToWishlist(updatedWishlist);
		    } else {
			    	// Set wishlist to localStorage
					localStorage.setItem('wishList', JSON.stringify(removeProduct));
		    }
	},500);
}


/* Google+ connect */

googlePlusConnect() {
	// Create google auth provider
    let provider = new firebase.auth.GoogleAuthProvider();
	// Open popup window to signin Google+
	firebase.auth().signInWithPopup(provider).then((result) => {
	 // Console.log results if you need info about user
	 window.location.reload();
	}).catch(function(error) {
		console.log(error);
	});
}


	render() {
		// If user is signed in and userDbInfo props is still null, display 'loading effect'.
		if(this.props.userIsSignedIn && this.props.userDbInfo === null) {
			return(<span>Încărcare...</span>)
		}


		return (
				<div>
					{/* Navigation */}
	                <div className='row justify-content-center'>
		                <div className='nav_path_cont col-11'>
		                 <span>
		                 	<Link to={'/'} className='nav_path_home'>
		                  	Acasă 
		                  	</Link>
		                  	/ 
		                  	Wishlist
		                  </span>
		                </div>    
	                </div>

	                <div className='row justify-content-center'> 
						<div className='wishlist_container col-11'>
							{/* Wishlist title */}
							<div className='row justify-content-center'>
								<span className='wishlist_title col-11'>
									Wishlist
									<span className='wishlist_title_no_items'>({this.props.wishList.length} {this.props.wishList.length === 1 ? 'articol' : 'articole'})</span>
								</span>
							</div>
							{/* Items container */}
							{this.props.wishList.length > 0 ? (
							<div className='row justify-content-center'>
								<div className='wishlist_wrap col-11'>
									<div className='row'>
										{this.props.wishList.map((prod,ind) => 
										<div key={ind} className='wish_product_box'>
											{/* Wishlist remove btn */} 
											<i className='fa fa-heart wish_remove_prod' onClick={(e)=>this.removeFromWishlistBtn(e,prod.id)}></i>
											{/* Wishlist product image */}
											<Link to={'/productinfo/'+prod.id}>
											<div className='row justify-content-center'>
											<img src={prod.img} alt=''/>
											</div>
											</Link>
											{/* Wishlist product name */}
											<div className='row justify-content-center'>
												<span className='wishprod_title'>{prod.name}</span>
											</div>
											{/* Wishlist product price /old price */}
											{/* If product is not available, display 'Out of stock' message */}
											{prod.availableProductNo !== 0 ? (
											<div className='row justify-content-center'>
												<span className='wishprod_price'>{prod.price} lei
													{prod.oldPrice !== undefined && (
													<span className='wishprod_old_price'>{prod.oldPrice} lei</span>
													)}
												</span>
											</div>
											):(
											<div className='row'>
												<span className='wishprod_outofstock'>Stoc epuizat</span>
											</div>
											)}
										</div>
										)}

									</div>

									<div className='row'>
										<span className='wishlist_info_bottom'>
											* Articolele adăugate în wishlist vor ramane salvate pentru o săptămână chiar dacă nu ești înregistrat. Conținutul wishlist-ului pentru clienții înregistrați este păstrat până când aceștia îl vor șterge manual.
										</span>	
									</div>
								</div>
							</div>
							):(
							<div className='row justify-content-center'>
								<div className='wishlit_empty_cont col-11'>
									<div className='row justify-content-center'>
										<div className='wishlist_empty_sec col-12 col-md-12 col-lg-6'>
											<div className='row justify-content-center'>
												<div className='wishlist_secone_wrap'>
													<span className='wishlist_subtitle_font'>Wishlist-ul tău este gol</span>
													<span className='wshl_subpoint'>Alege-ți produsele preferate apăsând pe <i className='far fa-heart'></i></span>
													<span className='wishlist_subtitle_font'>Cum se folosește wishlist-ul?</span>
													<span className='wshl_subpoint'>- Adăugarea unui produs la wishlist nu îl rezervă</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului este salvat automat</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului pentru clienții neînregistrați este păstrat pentru o saptămână</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului pentru clienții înregistrați este păstrat până când aceștia îl vor șterge manual</span>
												</div>
											</div>
										</div>
										<div className='wishlist_empty_sec col-12 col-md-12 col-lg-6'>
											<div className='row justify-content-center'>
												<div className='wishlist_sectwo_wrap col-12'>
													{/* Login button */ }
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font'>Ai deja cont ?</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Conectează-te pentru a sincroniza conținutul coșului între device-uri</span>
													</div>
													<div className='row justify-content-center'>
														<Link to={'/login'} className='wishlist_login_button'>Conectează-te</Link>
													</div>
													{/* Register button */}
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font mt-4'>Cont nou</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Înregistrează-te pentru a beneficia de multe oferte</span>
													</div>
													<div className='row justify-content-center'>
														<Link to={'/register'} className='wishlist_login_button wsh_register_btn'>Înregistrează-te</Link>
													</div>
													{/* Google plus button */ }
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font mt-4'>SAU</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Conectează-te rapid cu</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wishlist_google_plus_button' onClick={()=>this.googlePlusConnect()}>
															<i className='fab fa-google-plus-g'></i>Google+
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							)}
						</div>
					</div>
				</div>
			)
	}
}

const Wishlist = connect(mapStateToProps,mapDispatchToProps)(connectedWishlist);
export default Wishlist;
