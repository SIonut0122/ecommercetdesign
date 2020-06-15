import React from 'react';
import '../css/Cart.css';
import { Link               } from 'react-router-dom';
import { connect }            from "react-redux";
import { setCart,setWishList,setTotalCartAmount,setCartIsLoaded } from '../actions';
 import { client, q } from '../fauna/db';
import { addProdToDB } from './addProdToDB';



const mapStateToProps = state => {
  return {  
          cart       	  : state.cart,
          wishList   	  : state.wishList,
          userIsSignedIn  : state.userIsSignedIn,
          userDbInfo	  : state.userDbInfo

        };
};

function mapDispatchToProps(dispatch) {
  return {
          setCart            : cart     => dispatch(setCart(cart)),
          setWishList        : wishlist => dispatch(setWishList(wishlist)),
          setTotalCartAmount : amount => dispatch(setTotalCartAmount(amount)),
          setCartIsLoaded    : bol => dispatch(setCartIsLoaded(bol))
        };
}



class connectedCart extends React.Component {

	state ={
		cart : this.props.cart
	}



componentDidMount() {
	 if(this.props.userIsSignedIn !== null && this.props.userDbInfo === null) {
		this.populateCart();
	}
}

populateCart() {

	// When page loads, if user is connected & user data was fetched from userDbInfo, set userDbInfo cart
    if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
    	console.log('cart: SIGNED cart');
    		  let cartDb = this.props.userDbInfo.cart !== undefined ? this.props.userDbInfo.cart : [];
	          this.props.setCart({ cart: cartDb })
	          this.setState({ cart: cartDb })
	          // Check if inside cart are products that were added to the wishlist, and set prop to true
	          setTimeout(() => { this.checkWishlist(); },1500);
	          
	// If user is not connected, check cart on the localStorage
    } else {
    	// Check if wishList localStorage is not empty and wishList props was set; If not, set it.
	    if (window.localStorage.getItem('cart') !== null && !this.state.cart.length > 0 ) {
	          let cartLS = JSON.parse(localStorage.getItem('cart'));
	          this.props.setCart({ cart: cartLS })
	          this.setState({ cart: cartLS })
	          console.log('cart: LOCALSTORAGE cart');
	          // Check if inside cart are products that were added to the wishlist, and set prop to true
	          setTimeout(() => { this.checkWishlist(); },1500);
	    } 
    }
}

checkWishlist() {
	let cart           = [...this.props.cart],
	    wishListIdList = this.props.wishList.map(el => el.id);

	// Map through cart and check if any product is found inside wishlist
		// If product was found, set 'addedtowishlist' to true, to hightlight the 'Add to wishlist' button
	for(let c in cart) {
		if(wishListIdList.includes(cart[c].id)) {
			// If cart product's id match with any wishlist id, set addtowish to true
			cart[c].addedToWishlistFromCart = true;
		} else {
			cart[c].addedToWishlistFromCart = false;
		}
	}
	this.props.setCart({ cart: cart })
	localStorage.setItem('cart', JSON.stringify(cart));
}

cartAddToWishlist(e,product) {
	let cart     = [...this.props.cart],
		wishList = [...this.props.wishList];

	 const elementsIndex  = cart.findIndex(element => element.id === product.id),
	       wishListIdList = wishList.map(el => el.id);

	// If product was already added to the wishlist
	if(wishListIdList.includes(product.id)) {
		// Find product by index, and change addedtocart prop to false
	 	cart[elementsIndex] = {...cart[elementsIndex], addedToWishlistFromCart: false};
	 	this.props.setCart({ cart: cart })

		// Remove product from wishlist
		let removeProduct = wishList.filter((prod) => prod.id !== product.id);
		this.props.setWishList({ wishList: removeProduct })
		
		// If user is signed in, update userDB wishlist info
		if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
 			this.addRemoveWishlistedCartProd(removeProduct, removeProduct)
 		} else {
		// Set cart & wishlist localstorage
		localStorage.setItem('cart', JSON.stringify(cart));
		localStorage.setItem('wishList', JSON.stringify(removeProduct));
		}
	 
	} else {
		// Add product to wishlist
		// Find product by index, and change addedtocart prop to true
		cart[elementsIndex] = {...cart[elementsIndex], addedToWishlistFromCart: true};	 
		this.props.setCart({ cart: cart })

		// Add product to wishlist
		wishList.push(product);
 		this.props.setWishList({ wishList })

 		// If user is signed in, update userDB wishlist info
 		if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
 			this.addRemoveWishlistedCartProd(cart,wishList)
 		} else {
		// Set cart & wishlist localstorage
		localStorage.setItem('cart', JSON.stringify(cart));
		localStorage.setItem('wishList', JSON.stringify(wishList));
 		}
	}
}

addRemoveWishlistedCartProd(updatedCart,updatedWishlist) {
	// Here, we have to update wishlist and cart (addedToWishlist: false/true)
	// Get user id to target userDb on db
	let id = this.props.userDbId.ref.value.id;
	  	client.query(
		  q.Update(
		    q.Ref(q.Collection('users'), id),
		    { data: { cart: !updatedCart.length > 0 ? null : updatedCart,
		    		  wishlist: !updatedWishlist.length > 0 ? null : updatedWishlist} },
		  )
		)
		.then((ret) => console.log('Add/Remove wishlisted cart product'))
}


cartRemoveProduct(e,productId) {
	let cartproduct = document.querySelectorAll('.cart_product_b');
	// Map through all the cart DOM products
	cartproduct.forEach((modelNo) => {
		// If cart DOM product -> model id innerHTML is equal with the selected product id, set style while removing
		if(modelNo.querySelector('.cart_prod_id_no').innerHTML.substring(7,modelNo.length) === productId) {
			// Set style while removing/loading
			modelNo.setAttribute('style','opacity:0.6;pointer-events:none');
			// Remove product from cart/localstorage after 1.5 sec
			setTimeout(() => {
				let cart = [...this.props.cart];
					// Filter cart to remove the selected product from it
					let removeProduct = cart.filter((el) => el.id !== productId);
					this.props.setCart({ cart: removeProduct })

					if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
						 let id          = this.props.userDbInfo.ref.value.id,
		     				 updatedCart = {id: id, cart: removeProduct};
		     			     // Send new data to function
		     			     addProdToDB(updatedCart);
					} else {
					// Change localstorage after removing the product
					localStorage.setItem('cart', JSON.stringify(removeProduct));
					}

					// Remove attribute style from all the cart products
					modelNo.removeAttribute('style');
 
			},2500);
		} 
	})		
}


handleProductQuantityChange(e,cartProductId) {
	let cart = [...this.props.cart];
	 // Map through existing cart products for the changed input type
	 for(let c in cart) {
		if(cart[c].id === cartProductId) {
			// If changed quantity input value is a number and higher than 0 
			if(e.target.value.split('').every(x => x.match(/[0-9]+/g)) && e.target.value.length > 0) {
				// If changed quantity value starts with 0, get only the second number
				if(e.target.value.length > 1 && e.target.value[0] === '0') {
					// Set quantity converted to number
					cart[c].quantity = parseFloat(e.target.value[1]);
					this.setState({ cart })
				} else {
					// If quantity number match, change quant
					cart[c].quantity = parseFloat(e.target.value);
					this.props.setCart({ cart })
				}
			} else {
			// If changed quantity is not a number, set it to default 1
			cart[c].quantity = 1;
			this.props.setCart({ cart })
			}
		}
	}
}

handleBlurInputQuantity(e,cartProductId) {
	let cart = [...this.props.cart];
	// When user clicks outside the quantity input, recheck changes 
	// of quantity of all cart products and multiply it to its own price to get total amount price / delay 1.5sec
	setTimeout(() => {
		// Get blur out target index product
	 	 const elementsIndex = cart.findIndex(element => element.id == cartProductId );
	 	 // Find product by index, and change totalAmount
	 	 cart[elementsIndex] = {...cart[elementsIndex], totalAmount: cart[elementsIndex].quantity * cart[elementsIndex].price};

	 	this.props.setCart({ cart: cart })
		// Push cart to localstorage to be used on every mount
		localStorage.setItem('cart', JSON.stringify(cart));
	},1500);
}

getTotalCartAmount() {
	// Calculate cart total amount
	let allCartProductsTotalAmount = this.props.cart.map(prod => prod.totalAmount);
	let totalCartAmount            = allCartProductsTotalAmount.reduce((a,b) => a+b,0);
	// If totalCartAmount !== null, set it as props
	if(totalCartAmount) {
		this.props.setTotalCartAmount({ totalCartAmount })
	}
	return totalCartAmount;
}

getTotalCartSaveUpPercent() {
	let cart = [...this.props.cart],
		// Collect all discounts amounts to be displayed
		totalCartSaveUpAmount = []; 
	// Map through cart, if oldPrice => calculate oldprice - price and push result to totalCartSaveUpAmount
	for(let c in cart) {
		if(cart[c].oldPrice !== null) {
			let saveUp  = cart[c].oldPrice - cart[c].price;
			totalCartSaveUpAmount.push(parseFloat(saveUp.toFixed(2)));
		}
	}
	// Return total save up amount
	return totalCartSaveUpAmount.reduce((a,b) => a+b,0);
}



	render() {
 		
 		if(this.props.userIsSignedIn && this.props.userDbInfo === null) {
 			return (<span>Loading...</span>)
 		}

		return (
				<div>

					{/* Navigation */}
	                <div className='row justify-content-center'>
		                <div className='nav_path_cont col-11'>
		                 <span>
		                 	<Link to={'/'} className='nav_path_home'>
		                  	Acasa
		                  	</Link>
		                  	/ 
		                  	Cosul tau
		                  </span>
		                </div>    
	                </div>

	                <div className='row justify-content-center'> 
						<div className='cart_container col-11'>
							{/* Wishlist title */}
							<div className='row justify-content-center'>
								<span className='cart_title col-11'>
									Coșul tău
									<span className='cart_title_no_items'>({this.props.cart.length} {this.props.cart.length === 1 ? 'articol' : 'articole'})</span>
									<span className='cart_title_info'>{this.props.cart.length > 0 ? 'Nu mai amâna comanda - adăugarea produselor în coș nu înseamnă rezervare.' : ''}</span>
								</span>
							</div>

							{/* Empty Cart wrap */}
							{!this.props.cart.length > 0 ? (
							<div className='row justify-content-center'>
								<div className='empty_cart_container col-11'>
									{/* Empty cart box message */}
									<div className='row justify-content-center'>
										<div className='empty_cart_msg_box'>
											<span className='cart_title_font'><i className='fas fa-shopping-bag'></i>Coșul tau esti gol</span>
											<span className='cart_subtitle_font'>Vizualizează oferta noastră si vezi ce iti place :)</span>
											<Link to={'/'} className='cart_back_btn'>Pagina principală</Link>
										</div>
									</div>
									{/* Down info */}
									<div className='row justify-content-center'>
										<div className='empty_cart_info col-10'>
											<span className='cart_title_font_two'>Iti lipsesc produsele din cos ?</span>
											<span className='cart_subtitle_font'>Asigură-te că ești conectat la cont.</span>
											<span className='cart_subtitle_font'>Conectarea va sincroniza coșul de cumpărături cu celelalte device-uri.</span>
											<span className='cart_subtitle_font'>Pentru clienții neconectați, produsele vor rămâne în coș zece zile.</span>
										</div>
									</div>
								</div>
							</div>
							):(
							<React.Fragment>
								<div className='row justify-content-center'>
									<div className='cart_products_wrap col-11'>
										<div className='row justify-content-center'>
											{this.props.cart.map((cartProduct) =>
												<div className='cart_product_b col-12'>
													<div className='row'>
														{/* Cart product image */}
														<div className='cart_produdct_image col-12 col-md-3 col-lg-2'>
															<img src={cartProduct.img} alt=''/>
														</div>
														{/* Cart product info */}
														<div className='cart_product_info col-12 col-md-9 col-lg-8'>
															<span className='cart_prodinfo_title'>{cartProduct.name}</span>
															<span className='cart_prodinfo_subdetails cart_prod_id_no'>Model: {cartProduct.id}</span>
															<div className='row'>
																{/* Cart product info row two */}
																<div className='cart_prod_info_secrow col-12'>
																	<div className='cprod_inf_quant'>
																		Cantitate:
																		<input type='text'
																			   value={cartProduct.quantity}
																			   onBlur={(e) => this.handleBlurInputQuantity(e,cartProduct.id)}
																			   onChange={(e) => this.handleProductQuantityChange(e,cartProduct.id)}
																			   maxLength='2'/>
																	</div>
																	<span className='cprod_inf_refresh'><span>Actualizeaza</span></span>
																	<span className='cprod_inf_available'><i className='far fa-check-circle'></i> Produs disponsibil</span>
																	<span className='cprod_inf_size'>Marime: <span>{cartProduct.selectedSize}</span></span>
																	<span className='cprod_inf_color'>Culoare: <span style={{"backgroundColor": cartProduct.color}}></span></span>
																</div>
															</div>
														</div>
														{/* Cart product right */}
														<div className='cart_product_right col-12 col-lg-2'>
															{cartProduct.oldPrice !== null && (
															<span className='cart_prod_oldprice'>{cartProduct.oldPrice} lei</span>
															)}
															<span className='cart_prod_price'>{cartProduct.totalAmount.toFixed(2)} lei</span>
															<span className='cart_prod_discount ml-auto'>-{cartProduct.saveUpPercent}%</span>
														</div>	
													</div>
														{/* Cart product actions */}
													<div className='row'>
														<div className='d-xs-none col-sm-block col-md-3 col-lg-2 col_act_one'></div>
														<div className='cart_product_actions col-12 col-md-8'>
															<span className='card_prod_act card_prod_act_wishbtn' onClick={(e)=>this.cartAddToWishlist(e,cartProduct)}>
																{cartProduct.addedToWishlistFromCart ? (
																	<i className='fas fa-heart'></i>
																):(
																	<i className='far fa-heart'></i>
																)}
																Adauga la wishlist
															</span>
															<span className='card_prod_act card_prod_remove' onClick={(e)=>this.cartRemoveProduct(e,cartProduct.id)}>
															 	<i className='far fa-times-circle'></i>
																Sterge
															</span>
														</div>
													</div>
											</div>
											)}
										</div>
									</div>
								</div>

								<div className='row justify-content-center'>
									<div className='cart_bottom col-11'>
										<div className='row justify-content-center'>
											<div className='cart_bottom_sec col-12 col-md-5'>
												{/* Discount button */}
												<div className='row justify-content-center'>
													<span className='cart_bottom_cpn_title'>Ai un cupon de discount ?</span>
												</div>	
												<div className='row justify-content-center'>
													<div className='cart_bottom_usecpn'>
														<span className='cart_bottom_wrap_usecpn'>
															<input type='text' placeholder='Cod promotional'/>
														</span>
														<div className='row justify-content-center'>
															<span className='cart_bottom_applycpn'>Aplica</span>
														</div>
													</div>
												</div>
												{/* Back to homepage button */}
												<div className='row justify-content-center'>
													<Link to={'/'} className='cart_bottom_backbtn'>
														<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
														  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
														  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
														</svg>
														Inapoi la cumparaturi
													</Link>
												</div>
											</div>
											<div className='cart_bottom_sec order-first col-12 order-md-0 col-md-7'>
												<div className='row justify-content-center'>
													{/* Cart bottom totals */}
													<div className='cart_bottom_totals'>
															<div className='cart_subtotal cart_sbt'>
																<span className='cart_label'>Suma</span>
																<span className='cart_value'>{this.getTotalCartAmount()}</span>
															</div>
															<div className='cart_deliver cart_sbt'>
																<span className='cart_label'>Livrare</span>
																<span className='cart_value'>de la 14.99 lei</span>
															</div>
															<div className='cart_total cart_sbt'>
																<span className='cart_label'>Total</span>
																<span className='cart_value'>{this.getTotalCartAmount()}</span>
															</div>
															<div className='cart_savings cart_sbt'>
																<span className='cart_label'>Economisesti</span>
																<span className='cart_value'>{this.getTotalCartSaveUpPercent()} lei</span>
															</div>
															<Link to={'/checkout'} className='cart_totals_proceed_btn' onClick={() => { this.props.setCartIsLoaded({ cartIsLoaded: true }) }}>Mergi la casa</Link>
															<span className='cart_totals_underbtn_note'>* 30 de zile pentru returnare gratuită</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Bottom info note */}
								<div className='row justify-content-center'>
									<div className='cart_bottom_info col-10'>
										<span className='cart_bottom_info_title'>Probleme in procesarea produselor?</span>
										<span className='cart_bottom_info_subtitle'>Trimite-ne un email la 
											<a href='mailto:contact@thsirtdesign.ro'> contact@thsirtdesign.ro </a>
											si iti vom raspunde in maxim 24h.
										</span>
									</div>
								</div>
							</React.Fragment>
							)}
						</div>
					</div>


				</div>
			)
	}
}

const Cart = connect(mapStateToProps,mapDispatchToProps)(connectedCart);
export default Cart;

 