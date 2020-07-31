import   React   			   from 'react';
import { Link                } from 'react-router-dom';
import { connect             } from "react-redux";
import { client, q           } from '../fauna/db';
import { addProdToCart       } from '../fauna/addProdToCart';
import { addProdToWishlist   } from '../fauna/addProdToWishlist';
import { setCart,setWishList,
		 setTotalCartAmount,
		 setCartIsLoaded     } from '../actions';
import '../css/Cart.css';


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
          setTotalCartAmount : amount   => dispatch(setTotalCartAmount(amount)),
          setCartIsLoaded    : bol      => dispatch(setCartIsLoaded(bol))
        };
}



class connectedCart extends React.Component {

	state = { cart : this.props.cart }



componentDidMount() {
	if(this.props.userIsSignedIn !== null && this.props.userDbInfo === null) {
		this.populateCart();
	}
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}

populateCart() {

	// When page loads, if user is connected & user data was fetched from userDbInfo, set userDbInfo
    if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
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
	let cart           = [...this.props.cart],
		wishList       = [...this.props.wishList],
		// Get product's index to change 'addedtocart' prop to false
        elementsIndex  = cart.findIndex(element => element.id === product.id),
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
 			// Collect id and wishlist inside an object
			let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist: removeProduct},
		        updatedCart     = {id: this.props.userDbInfo.ref.value.id, cart: cart};
			    // Send new info to userDb
			    addProdToWishlist(updatedWishlist);
				addProdToCart(updatedCart);
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
 			 // Send new info to userDb
			let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist: wishList},
		        updatedCart     = {id: this.props.userDbInfo.ref.value.id, cart: cart};
			    addProdToWishlist(updatedWishlist);
				addProdToCart(updatedCart);
 		} else {
				// Set cart & wishlist localstorage
				localStorage.setItem('cart', JSON.stringify(cart));
				localStorage.setItem('wishList', JSON.stringify(wishList));
 		}
	}
}

cartRemoveProduct(e,product) {
	let cartproduct = document.querySelectorAll('.cart_product_b');
	// Map through all the cart DOM products
	cartproduct.forEach((modelNo) => {
		// If cart DOM product -> model id innerHTML is equal with the selected product id, set style while removing
		if(modelNo.querySelector('.cart_prod_id_no').innerHTML.substring(7,modelNo.length) === product.id) {
			// Set style while removing/loading
			modelNo.setAttribute('style','opacity:0.6;pointer-events:none');
			// Remove product from cart/localstorage after 1.5 sec
			let removeProduct;

			setTimeout(() => {
				let cart = [...this.props.cart];
					for(let i in cart) {
						// If there are multiple products with the same id, search for the specific product comparing the color and size
						if(cart[i].id === product.id && cart[i].color === product.color && cart[i].selectedSize === product.selectedSize) {
							// If product inside cart match, get the index
							const indexProd = cart.indexOf(cart[i]);
							// Filter cart to remove the selected product using the indexProd
							removeProduct = cart.filter((el) => cart.indexOf(el) !== indexProd);
							this.props.setCart({ cart: removeProduct })
							break;
						}
					}


					// If user is signed in, update cart from database		
					if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
		     			let updatedCart = {id: this.props.userDbInfo.ref.value.id, cart: removeProduct};
		     			     // Send new data to function
		     			     addProdToCart(updatedCart);
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

	// If user is signed in and data was fetched, send data to user db
	if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
			 let updatedCart = {id: this.props.userDbInfo.ref.value.id, cart: cart};
 			     // Send new data to function
 			     addProdToCart(updatedCart);
		} else {
			// Change localstorage after removing the product
			localStorage.setItem('cart', JSON.stringify(cart));
		}

	this.handleBlurInputQuantity(e,cartProductId);
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

	 	 this.props.setCart({ cart })

	 	// Update userDb if user is signed in. Otherwise, update localstorage
	 	if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
 			let updatedCart = {id: this.props.userDbInfo.ref.value.id, cart: cart};
 			     // Send new data to function
 			     addProdToCart(updatedCart);
		} else {
			// Change localstorage after removing the product
			localStorage.setItem('cart', JSON.stringify(cart));
		}

	},500);
}

handleProductQuantityKey(e,cartProductId) {
	if(e.key === 'Enter') 
		this.handleBlurInputQuantity(e,cartProductId) 
}

getTotalCartAmount() {
	// Calculate cart total amount
	let allCartProductsTotalAmount = this.props.cart.map(prod => prod.totalAmount);
	let totalCartAmount            = allCartProductsTotalAmount.reduce((a,b) => a+b,0);
	// If totalCartAmount !== null, set it as props
	if(totalCartAmount) {
		this.props.setTotalCartAmount({ totalCartAmount })
	}

	// Return recalculated total cart amount
	return parseFloat(totalCartAmount.toFixed(2));
}

getTotalCartSaveUpPercent() {
	let cart                  = [...this.props.cart],
	// Collect all discounts amounts to be displayed
		totalCartSaveUpAmount = []; 
	// Map through cart, if oldPrice => calculate (oldprice - price) * product quantity and push result to totalCartSaveUpAmount
	for(let c in cart) {
		if(cart[c].oldPrice !== undefined) {
			let saveUp  = (cart[c].oldPrice - cart[c].price) * cart[c].quantity;
			totalCartSaveUpAmount.push(parseFloat(saveUp.toFixed(2)));
		
		}
	}
 
		// Set total cart save up amount with delay of 1 sec
		return totalCartSaveUpAmount.reduce((a,b) => a+b,0);
}



	render() {
 		
 		// While user is loading and userDb is null, display loading effect
 		if(this.props.userIsSignedIn === null && this.props.userDbInfo === null) {
 			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
 		}

 		// Check saveup percent
 		let saveUp = this.getTotalCartSaveUpPercent();

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
		                  	Coșul tău
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
											 
											  <span className='cart_title_font'><i className='fas fa-shopping-bag'></i>Coșul tău este gol</span>
											  <span className='cart_subtitle_font'>Vizualizează oferta noastră și vezi ce îți place :)</span>
											  <Link to={'/'} className='cart_back_btn'>Pagina principală</Link>
											 
										</div>
									</div>
									{/* Down info */}
									<div className='row justify-content-center'>
										<div className='empty_cart_info col-10'>
											<span className='cart_title_font_two'>Îți lipsesc produsele din coș ?</span>
											<span className='cart_subtitle_font'>Asigură-te că ești conectat la cont.</span>
											<span className='cart_subtitle_font'>Conectarea va sincroniza coșul de cumpărături cu celelalte device-uri.</span>
											<span className='cart_subtitle_font'>Pentru clienții neconectați, produsele vor rămâne în coș o săptămână.</span>
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
																		<input type      = 'text'
																			   value     = {cartProduct.quantity}
																			   onBlur    = {(e) => this.handleBlurInputQuantity(e,cartProduct.id)}
																			   onChange  = {(e) => this.handleProductQuantityChange(e,cartProduct.id)}
																			   onKeyPress = {(e) => this.handleProductQuantityKey(e,cartProduct.id)}
																			   maxLength = '2'/>
																	</div>
																	<span className='cprod_inf_refresh'><span onClick={() => { window.location.reload() }}>Actualizează</span></span>
																	<span className='cprod_inf_available'><i className='far fa-check-circle'></i> Produs disponsibil</span>
																	<span className='cprod_inf_size'>Mărime: <span>{cartProduct.selectedSize}</span></span>
																	<span className='cprod_inf_color'>Culoare: <span style={{"backgroundColor": cartProduct.color}}></span></span>
																</div>
															</div>
														</div>
														{/* Cart product right */}
														<div className='cart_product_right col-12 col-lg-2'>
															{/* If product has no offer to calculate, do not render oldPrice & saveUppercent */}
															{cartProduct.oldPrice !== undefined && (
															<span className='cart_prod_oldprice'>{cartProduct.oldPrice} lei</span>
															)}

															{/* Total cart product amount after calculation */}
															<span className='cart_prod_price'>{cartProduct.totalAmount.toFixed(2)} lei</span>

															{cartProduct.oldPrice !== undefined && (
															<span className='cart_prod_discount ml-auto'>-{cartProduct.saveUpPercent}%</span>
															)}
														</div>	
													</div>
														{/* Cart product actions */}
													<div className='row'>
														<div className='d-xs-none col-sm-block col-md-3 col-lg-2 col_act_one'></div>
														<div className='cart_product_actions col-12 col-md-8'>
															<span className='card_prod_act card_prod_act_wishbtn' onClick={(e)=>this.cartAddToWishlist(e,cartProduct)}>
																{/* Change wishlisted icon if product was added to wishlist or not */}
																{cartProduct.addedToWishlistFromCart ? (
																	<i className='fas fa-heart'></i>
																):(
																	<i className='far fa-heart'></i>
																)}
																Adaugă la wishlist
															</span>
															<span className='card_prod_act card_prod_remove' onClick={(e)=>this.cartRemoveProduct(e,cartProduct)}>
															 	<i className='far fa-times-circle'></i>
																Șterge
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
															<input type='text' placeholder='Cod promoțional'/>
														</span>
														<div className='row justify-content-center'>
															<span className='cart_bottom_applycpn'>Aplică</span>
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
														Înapoi la cumpărături
													</Link>
												</div>
											</div>
											<div className='cart_bottom_sec order-first col-12 order-md-0 col-md-7'>
												<div className='row justify-content-center'>
													{/* Cart bottom totals */}
													<div className='cart_bottom_totals'>
															<div className='cart_subtotal cart_sbt'>
																<span className='cart_label'>Sumă</span>
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
															{saveUp !== 0 && (
															<div className='cart_savings cart_sbt'>
																<span className='cart_label'>Economisești</span>
																<span className='cart_value'>{saveUp} lei</span>
															</div>
															)}

															{this.props.userDbInfo !== null && this.props.userIsSignedIn ? (
															<Link to={'/checkout'} className='cart_totals_proceed_btn' onClick={() => { this.props.setCartIsLoaded({ cartIsLoaded: true }) }}>Mergi la casă</Link>
															):(
															<Link to={'/login'} className='cart_totals_proceed_btn'>Conectează-te</Link>
															)}

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
										<span className='cart_bottom_info_title'>Probleme în procesarea produselor?</span>
										<span className='cart_bottom_info_subtitle'>Trimite-ne un email la 
											<a href='mailto:contact@thsirtdesign.ro'> contact@thsirtdesign.ro </a>
											și îți vom răspunde în maxim 24h.
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

 