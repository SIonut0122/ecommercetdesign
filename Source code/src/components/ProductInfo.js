import   React                   from 'react';
import { Link                  } from 'react-router-dom';
import { FacebookShareButton   } from 'react-share';
import { connect               } from "react-redux";
import { setWishList, setCart,
		 setWomenProductsDb,
		 setMenProductsDb,
		 setChildrenProductsDb } from '../actions';
import { client, q }             from '../fauna/db';
import { addProdToCart }         from '../fauna/addProdToCart';
import { addProdToWishlist }     from '../fauna/addProdToWishlist';
import   getAllWomenProducts     from './products/getAllWomenProducts';
import   getAllMenProducts       from './products/getAllMenProducts';
import   getAllChildrenProducts  from './products/getAllChildrenProducts';
import   PageNotFound            from './Pagenotfound';
import '../css/ProductInfo.css';





const mapStateToProps = state => {
  return {  
          wishList               : state.wishList,
          cart                   : state.cart,
          userIsSignedIn         : state.userIsSignedIn,
          userDbInfo             : state.userDbInfo,
          menProductsDataDb      : state.menProductsDataDb,
          womenProductsDataDb    : state.womenProductsDataDb,
          childrenProductsDataDb : state.childrenProductsDataDb 
        };
};

function mapDispatchToProps(dispatch) {
  return {
          setWishList           : wishlist       => dispatch(setWishList(wishlist)),
          setCart               : cart           => dispatch(setCart(cart)),
          setMenProductsDb      : menProdDb      => dispatch(setMenProductsDb(menProdDb)),
          setWomenProductsDb    : womenProdDb    => dispatch(setWomenProductsDb(womenProdDb)),
          setChildrenProductsDb : childrenProdDb => dispatch(setChildrenProductsDb(childrenProdDb)),
        };
}




class connectedProductInfo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			productInfo        : null,
			productInfoFound   : null,
			addedToWishList    : false,
			addedToWishListMsg : null,
			selectedSize       : '',
			selectSizeErrMsg   : false,
			saveUpPercent      : null,
			backgroundPosition : '0% 0%',
			allProductsDataDb  : null
		}

}

componentDidMount() {
	// Search a product with the desired url id
	 this.fetchAllProductsData();
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}


componentDidUpdate(prevProps) {
	// Listen to params url id changes and if prevState id !== this.id, call function
	if(prevProps.match.params.id !== this.props.match.params.id) {
		this.fetchAllProductsData();
	}

	// If user is logged in or nor and wishList was loaded, check if this products was already inside wishlist and set icon to true
	if(prevProps.wishList !== this.props.wishList && this.state.productInfo !== null) {
		this.props.wishList.forEach((el) => { if(el.id === this.state.productInfo.id) { this.setState({ addedToWishList: true }) } })
	}

}

async fetchAllProductsData() {
		let newArray = [], allProductsDataDb;

		// If products data was not fetched before, start fetching all data
		if(this.props.menProductsDataDb === null || this.props.womenProductsDataDb === null || this.props.childrenProductsDataDb === null) {
			let getMen = await getAllMenProducts
			.then((menProdData) => {
				// Collect inside menProductsData only menProds data
			     	let menProductsData = [];
			     	// Extract only data
			     	menProdData.forEach(el => {
			     		el.data.refId = el.ref.value.id; 
			     		menProductsData.push(el.data) 
			     	});

			     	this.props.setMenProductsDb({ menProductsDataDb: menProductsData })
			     	// After men data was fetched, call to fetch womenproductsdata
			     	this.fetchWomenProductsData(menProductsData);

			     	// if any erros while fetching men data, display error
			}).catch((error) => console.log('Error while fetching menData: ', error.message))
				
				// If all data was fetched before, collect in into one array and send it to display
		} else if(this.props.menProductsDataDb !== null && this.props.womenProductsDataDb !== null && this.props.childrenProductsDataDb !== null) {
				allProductsDataDb = [...newArray, ...this.props.menProductsDataDb, ...this.props.womenProductsDataDb, ...this.props.childrenProductsDataDb];
				this.displayProductInfo(allProductsDataDb);
		}

}

async fetchWomenProductsData(menProductsData) {
	let newArray    = [], allProductsDataDb,
		menProdData = menProductsData;

	// Then, fetch all womens products
 	let getWomen = await getAllWomenProducts
 	.then((womenProdData) => {
 		let womenProductsData = [];
     	// Extract only data
     	womenProdData.forEach(el => {
     		el.data.refId = el.ref.value.id; 
     		womenProductsData.push(el.data) 
     	});
     	this.props.setWomenProductsDb({ womenProductsDataDb: womenProductsData })
     	// After women data was fetched, call to fetch childrenproductsdata
     	this.fetchChildrenProductsData(menProdData, womenProductsData);

 	}).catch((error) => console.log('Error while fetching womenData: ', error.message))
}

async fetchChildrenProductsData(menProductsData, womenProductsData) {
	let newArray             = [], allProductsDataDb,
		menProdData          = menProductsData,
		womenProdData        = womenProductsData,       
 		childrenProductsData = [];
		 
	// Then, fetch all womens products
 	let getChildren = await getAllChildrenProducts
 	.then((childrenProdData) => {
     	// Extract only data
     	childrenProdData.forEach(el => {
     		el.data.refId = el.ref.value.id; 
     		childrenProductsData.push(el.data) 
     		
     		if(childrenProdData.length === childrenProductsData.length) {
     		this.props.setChildrenProductsDb({ childrenProductsDataDb: childrenProductsData })
	     	// After fetchind men and woman data, collect all into one array and send it to display
	     	allProductsDataDb = [...newArray, ...menProdData, ...womenProdData, ...childrenProductsData];
	     	this.displayProductInfo(allProductsDataDb);    		
     		}
     	});
 	}).catch((error) => console.log('Error while fetching childrenData: ', error.message))


}

displayProductInfo(allProductsDataDb) {
    let allProductsData = allProductsDataDb;
  	// Loop through all products for the URL PARAM ID and get products info
 	for(let p in allProductsData) {
 		if(allProductsData[p].id === this.props.match.params.id) {
 			// Restore profile image to product (Hovering changes profile image before click)
 			allProductsData[p].img          = allProductsData[p].moreImages[0];
 			// Set found product to true and product info to be displayed
 			this.setState({ productInfoFound: true, productInfo: allProductsData[p], allProductsDataDb: allProductsData })
 			// Set document title with the name of product
			document.title = allProductsData[p].name+' | TshirtDesign.com';
 			// Check if product is in the wishlist
 			this.props.wishList.forEach((prod) => { 
 					if(prod.id === this.props.match.params.id) {
 						this.setState({ addedToWishList: true })
 					} 
 				})
 			break; // Break when first product was found. Avoid changing productInfoFound to false and displaying 404 error
 		}  else {
 			this.setState({ productInfoFound: false })
 		}
 	}


}

handleProdInfoMoreImg(e,img) {
	// Highlight clicked image
	const moreImgGallery = document.querySelectorAll('.pinfo_moreimg_gallery');
		  moreImgGallery.forEach((img) => img.setAttribute('style','2px solid transparent'));
		  e.target.style.border = '2px solid #202020';
		  // Set clicked image from product info gallery to product info general image to be viewed
		  this.setState(prevState => ({
		  	productInfo: {
		  		...prevState.productInfo,
		  		img: img
		  	}
		  }))
}

handleSelectColor(e) {
	// Highlight clicked color box
	const productColors = document.querySelectorAll('.prodinfo_color_value');
		  productColors.forEach((color) => color.style.border = '1px solid #C6C6C6');
		  e.target.style.border = '3px solid #007bff';
}

handleSelectSize(e) {
	// Highlight clicked size box
	const productSizes = document.querySelectorAll('.prodinfo_wrsizes_sizevalue');
		  productSizes.forEach((size) => { size.style.border = '2px solid #C6C6C6';size.style.color = 'inherit'; });
		  e.target.style.border = '2px solid #007bff';
		  e.target.style.color  = ' #007bff';
		  // Set selected color
		  this.setState({ selectedSize: e.target.innerHTML })
}

prodInfoAddToWishlistBtn(e,bol) {
	let addedToWishlistMsg = document.querySelector('.prodinfo_addedtowishlist_msg');

	if(!this.state.addedToWishList) {
		  // If bol is true, set state to display full heart svg icon
		  this.setState({ addedToWishList: true })
		  // Set innerHTML text on the 'added to wishlist' message and animate it
		  addedToWishlistMsg.innerHTML = 'Produsul a fost adaugat in wishlist';
		  addedToWishlistMsg.style.width = '100%';
 		  // Give delay of 250 milisec to render the .red heart svg button and add to it this class to dezactivate it for 3 sec to leave time to display the msg
 		  setTimeout(() => { document.querySelector('.addto_wsh_full').classList.add('addtowish_bnt_inactive'); },250);
 		  setTimeout(() => { document.querySelector('.addto_wsh_full').classList.remove('addtowish_bnt_inactive');},3200);

 		  // Push this product inside wishlist
 		  let wishList = [...this.props.wishList];
 		   	  wishList.push(this.state.productInfo);
	 		  
		    // Set new props wishlist
			this.props.setWishList({ wishList })

			// If user is signed in, update userDB
			if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
			// Collect id and wishlist inside an object
			let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist: wishList};
		    // Call function to update userDb  is user is signed in
		    addProdToWishlist(updatedWishlist);
			} else {
 		    // Push wishlist to localstorage if user is not signed in
		    localStorage.setItem('wishList', JSON.stringify(wishList));
		 	}

	} else {
		// If product was already inside the wishlist, proceed to remove.
		  // Same thing as above /\ but reversed
		  this.setState({ addedToWishList: false })
		  addedToWishlistMsg.style.width = '100%'; 
		  addedToWishlistMsg.innerHTML = 'Produsul a fost sters din wishlist';
		  setTimeout(() => { document.querySelector('.addto_wsh_empty').classList.add('addtowish_bnt_inactive');},250);
		  setTimeout(() => { document.querySelector('.addto_wsh_empty').classList.remove('addtowish_bnt_inactive');},3200);

		  // Remove from wishlist
		  let removeProduct = [...this.props.wishList].filter((prod) => prod.id !== this.props.match.params.id);
		  this.props.setWishList({ wishList: removeProduct })
		  	
		  	// If user is signed in, update userDB
		    if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
		    // Collect id and wishlist inside an object
			let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist: removeProduct};
		    // Call function to update userDb  is user is signed in
		    addProdToWishlist(updatedWishlist);
			} else {
			// Push wishlist to localstorage if user is not signed in
		    localStorage.setItem('wishList', JSON.stringify(removeProduct));
		 	}
		}

		  // Hide 'added to wishlist/remove from wishlist' every time after 3 sec
 		  setTimeout(() => { addedToWishlistMsg.style.width = '0'},3000);
}


prodInfoAddToCart(e,product) {
	// Check is size was selected and animate button. After this, call function to addtocart
	if(this.state.selectedSize.length > 0) {
		// If 'Please select size' error message is displayed, hide it.
		this.setState({ selectSizeErrMsg: false })
		// Enable animation for 'Add to cart' button
		// Disable 'Add to cart' button for 2 seconds
		e.target.setAttribute('style','opacity:0.8;pointer-events:none');
		setTimeout(() => {
			// Remove style from add to cart btn to activate it again
			if(document.querySelector('.prodinfo_addtocart_bnt') !== null) {
				document.querySelector('.prodinfo_addtocart_bnt').removeAttribute('style');
			}
			if(document.querySelector('.pinf_addtocart_txt') !== null) {
			document.querySelector('.pinf_addtocart_txt').innerHTML = 'Adăugat în coș';
			}
			// Animate bag icon from 'Add to cart' button
			if(document.querySelector('.addtocart_i_bag') !== null) {
				document.querySelector('.addtocart_i_bag').classList.add('addtocart_i_grow');
			}
			// Call function to add product to cart
			this.addProductToCart(product);

			// Highlight clicked size box
			const productSizes = document.querySelectorAll('.prodinfo_wrsizes_sizevalue');
				  productSizes.forEach((size) => { size.style.border = '2px solid #C6C6C6'; size.style.color = 'inherit'; });

		},1500);
			// Remove classname which animate the icon bag from 'Add to cart' btn
		setTimeout(() => {
				if(document.querySelector('.addtocart_i_bag') !== null) {
					document.querySelector('.addtocart_i_bag').classList.remove('addtocart_i_grow');
				}
		},1800);

	} else {
		// If size is not selected, display error message
		this.setState({ selectSizeErrMsg: true })
	}
}

addProductToCart(product) {
	let cart       = [...this.props.cart],
		newProduct = {...product};

		// If product oldPrice was set, calculate the save up percentage
		if(product.oldPrice !== undefined) {
		// Calculate the save up percent and add it to product prop 
		let decr          = this.state.productInfo.oldPrice - this.state.productInfo.price;
		let saveUpPercent = Math.round((decr / this.state.productInfo.oldPrice) * 100).toFixed(0);
	    	newProduct.saveUpPercent = saveUpPercent;
	    }
	 	// Set new values for the new prduct
	 		newProduct.selectedSize  = '';
	 		newProduct.img           = newProduct.moreImages[0];
			newProduct.quantity      = 1;
		    newProduct.totalAmount   = product.price;
		    newProduct.selectedSize  = this.state.selectedSize;
		    newProduct.refId         = product.refId;
 

		let alreadyInsideCart = false,
			elementIndex;

	for(let i in cart) {
		if(cart[i].id === newProduct.id) {
			if(cart[i].color == newProduct.color && cart[i].selectedSize == this.state.selectedSize) {
				// Set alreadyinside to true, if found and get indexOf product
				alreadyInsideCart = true;
				// Ge tthe index of the founded element
				elementIndex      = this.props.cart.indexOf(cart[i]);

				 // If quantity number is lower than 99, increase product quantity by one
			 	 cart[elementIndex] = {...cart[elementIndex], quantity: cart[elementIndex].quantity < 99 ? cart[elementIndex].quantity+1 : 99 };
			 	 // Calculate totalAmount of the prduct (quantity * product price) 
			 	 cart[elementIndex] = {...cart[elementIndex], totalAmount: cart[elementIndex].quantity * cart[elementIndex].price};

			 	 this.props.setCart({ cart: cart })

			 	 // If user is signed in, send data to userDB, if not, set it to localStorage
				 if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
				 // Send user id and updated cart param to function 
				 let id          = this.props.userDbInfo.ref.value.id,
				     updatedCart = {id: id, cart: cart};
					 addProdToCart(updatedCart)
				 } else {	
				 // Push cart to localstorage to be used on every mount
				 localStorage.setItem('cart', JSON.stringify(cart));
				}
				this.setState({ selectedSize: '' })
				// Break when product was found
				break;
			}
		}
	}
 
		// Check if clicked product is already inside cart
	if(!alreadyInsideCart) {
			console.log('NEW PRODUCT: '+newProduct.color, newProduct.selectedSize);
	 	 // If product was not found inside Cart, push it, with quantity propriety/totalAmount = product.price and selectedSize
 		 cart.push(newProduct);
 		 // Set props with new added cart products
		 this.props.setCart({ cart: cart })

		 // If user is signed in, send data to userDB, if not, set it to localStorage
		 if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
		 // Set DB cart
		 let id          = this.props.userDbInfo.ref.value.id,
		     updatedCart = {id, cart};
			 addProdToCart(updatedCart)
		 } else {	
		 // Push cart to localstorage to be used on every mount
		 localStorage.setItem('cart', JSON.stringify(cart));
		 }
		this.setState({ selectedSize: '' })
	 }		  
}

setPathName() {
	// If clicked product info was found, render nav pathname depending of what category type gender is
	if(this.state.productInfoFound) {
		switch(this.state.productInfo.category) {
			case "men":
				return ( <span><Link to={'/products/men'}> Imbrăcaminte bărbați</Link> / {this.state.productInfo.name}</span> );
				break;
			case "women":
				return ( <span><Link to={'/products/women'}> Imbrăcaminte femei</Link> / {this.state.productInfo.name}</span> );
				break;
			case "children":
				return ( <span><Link to={'/products/children'}> Imbrăcaminte copii</Link> / {this.state.productInfo.name}</span> );
				break;
			default:
				return;
		} 
	}
}

saveUpTo() {
	// Calculate the save up percent and display it to the product info
	let decr = this.state.productInfo.oldPrice - this.state.productInfo.price;
	let save = Math.round((decr / this.state.productInfo.oldPrice) * 100).toFixed(0);
 
	return save;
}

handleImgMouseMove(e) {
 	// Calculate user's cursor position, and set new background pos
    const { left, top, width, height } = e.target.getBoundingClientRect(),
          x = (e.pageX - left) / width * 100,
          y = (e.pageY - top) / height * 100;
    this.setState({ imgHovering: true, backgroundPosition: `${x}% ${y}%` })
}


	render() {

		// Display loading effect while fetching data
		if(this.state.allProductsDataDb === null) {
			return (
				<div className='account_loading_modal'>
					<div className='row justify-content-center h-100'>
						<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
					</div>
				</div>)
		}


		// Set new style for image zoom when productInfo !== null
		let zoom_style = this.state.productInfo !== null && this.state.imgHovering ? { backgroundImage : `url(${this.state.productInfo.img})`, backgroundPosition : this.state.backgroundPosition } : {};

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
		                  	{this.setPathName()}
		                  </span>
		                </div>    
	                </div>

	                {() => this.scrollToTop()}

	                <div className='row justify-content-center'>
	                	<div className='productinfo_container col-11'>

	                	{/* Display loading effect while fetching data */}
	                	{this.state.productInfoFound === null && (
	                		<div className='prodinfo_load_cont'><div></div><div></div><div></div><div></div></div>
	                	)}

	                	{/* If data was found, display product */}
	                	{this.state.productInfoFound ? (
	                		<React.Fragment>
		                		<div className='row justify-content-center'>
		                			<div className='prodinfo_sec_img prodinfo_section col-12 col-lg-6'>

		                				{/* Product info profile image */}
		                				<span className='prodinfo_img_prof' onMouseMove={(e) => this.handleImgMouseMove(e)} onMouseOut={()=>{this.setState({ imgHovering: false })}} style={zoom_style}>
		                				<img src={this.state.productInfo.img} alt=''/>
		                				</span>
		                				<div className='prodinfo_sec_img_gallery'>
		                					{this.state.productInfo.moreImages.map((img,ind) =>
		                					<img src={img} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e,img)}/>
		                					)}
		                			
		                				</div>
		                			</div>
		                			<div className='prodinfo_info_sec prodinfo_section col-12 col-lg-6'>
		                			 	
		                			 	{/* Added/removed from wishlist message */}
		                				<span className='prodinfo_addedtowishlist_msg'></span>
		                				
		                				{/* Product title and 'add to wishlist' icon */}
		                				<div className='prodinfo_prod_title'>
		                					{this.state.productInfo.name}

		                					{/* Render only if user is logged in or not; Avoid click while loading */}
		                					{this.props.userIsSignedIn !== null && (
		                					<React.Fragment>
		                				 	{this.state.addedToWishList ? (
		                				 		<svg onClick={(e)=>this.prodInfoAddToWishlistBtn(e)} className="bi bi-heart-fill addto_wsh_full" width="1em" height="1em" viewBox="0 0 16 16" fill="#FF3E3E" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
												</svg>
		                				 	):(
		                				 		<svg onClick={(e)=>this.prodInfoAddToWishlistBtn(e)} className="bi bi-heart addto_wsh_empty" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
												</svg>
		                				 	)}
		                				 	</React.Fragment>
		                				 	)}
		                				</div>

		                				{/* Product model */}
		                				<span className='prodinfo_prod_modelno'>Număr model: {this.state.productInfo.id}</span>

		                				{/* Product new icon */}
		                				{this.state.productInfo.new && (
		                				<span className='prodinfo_prod_new_icon'>NOU !</span>
		                				)}

		                				{/* Original price / old price */}
		                				<span className='prodinfo_prod_price'>
		                					<span className='prodinfo_prod_act_price'>{this.state.productInfo.price} LEI</span>
		                					{this.state.productInfo.oldPrice !== undefined && (
		                					<span className='prodinfo_prod_old_price'>{this.state.productInfo.oldPrice+' LEI'}</span>
		                					)}
		                				</span>

		                				{/* Save up to */}
		                				{this.state.productInfo.oldPrice !== undefined && (
		                				<span className='prodinfo_prod_saveupto'>Economisești <span>{this.saveUpTo()} %</span></span>
		                				)}

		                				{/* Color */}
		                				<span className='prodinfo_prod_prodcolor'><span>Culoare:</span><span style={{backgroundColor: this.state.productInfo.color}}></span></span>

		                				{/* More product colors */}
		                				{this.state.productInfo.moreColors.length > 0 && (
		                				<React.Fragment>
			                				<span className='prodinfo_prod_color_title'>Culori</span>
			                				<div className='prodinfo_prod_wrap_colors'>
			                					{this.state.productInfo.moreColors.map((mc,ind) =>
			                					<Link to={mc.url} key={ind} className='prodinfo_color_value' style={{backgroundColor: mc.color}}></Link>
			                					)}
			                				</div>
		                			 	</React.Fragment>
		                			 	)}


		                				{/* Sizes */}
		                				<span className='prodinfo_prod_size_title'>Mărime</span>
		                				<div className='prodinfo_prod_wrap_sizes'>
		                					{this.state.productInfo.size.map((size,ind) =>
		                					<span key={ind} className='prodinfo_wrsizes_sizevalue' onClick={(e)=>this.handleSelectSize(e)}>{size}</span>
		                					)}
		                				</div>
		                				{this.state.selectSizeErrMsg && (
		                				<span className='prodinfo_err_msg'>Selectează mărimea</span>
		                				)}

	                               		{/* Add to cart button */}
	                               		{/* If product info availableproduct number stock is 0, render 'Out of stock' button */}
		                				{this.state.productInfo.availableProductNo > 0 ? (
		                					<span className='prodinfo_addtocart_bnt' onClick={(e)=>this.prodInfoAddToCart(e,this.state.productInfo)}>
		                					<i className='fas fa-shopping-bag addtocart_i_bag' aria-hidden='true'></i>
		                					<span className='pinf_addtocart_txt'>Adaugă în coș</span>
		                				</span>
		                				): (
		                					<span className='prodinfo_addtocart_bnt prodinfo_addcart_nostock'>
		                					<i className='fas fa-shopping-bag addtocart_i_bag' aria-hidden='true'></i>
		                					<span className='pinf_addtocart_txt'>Stoc epuizat</span>
		                					</span>
		                				)}

		                				{/* Share product button */}
		                				<FacebookShareButton url       = {window.location.href}
	                                                         quote     = {'Bună! Uite ce tricou super am gasit! :)'} 
	                                                         className = 'prodinfo_prod_sharefb'>
	                                       <i className='fas fa-share-alt'></i>Distribuie pe Facebook
	                                   </FacebookShareButton>
		                			</div>
		                		</div>

		                		{/* Product ro description */}

		                		<div className='row justify-content-center'>
		                			<div className='productinfo_aboutprod_info col-12'>
		                				<span className='pi_ap_i_sep col-12'></span>
		                				<div className='row justify-content-center'>
		                					<div className='prodinfo_aboutprod_info_sec col-12 col-lg-6'>
		                						<span className='pinfo_aboutp_info_title'>Despre produs</span>

		                						{this.state.productInfo.ro.map((ro,ind) =>
		                							<React.Fragment key={ind}>
		                							<span className='pinfo_aboutp_info_subtitle'>{ro.type}</span>
		                							<span className='pinfo_aboutp_info_descr'>{ro.descr}</span>
		                							</React.Fragment>
		                						)}
		                						<span className='pinfo_aboutp_info_subtitle'>Instrucţiuni de întreţinere</span>
		                						<span className='pinfo_aboutp_info_descr'>Spălare la maşină la 40°</span>
		                						<span className='pinfo_aboutp_info_descr'>Nu folosiţi întălbitor</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Număr articol</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.id}</span>

		                					</div>
		                					<div className='prodinfo_aboutprod_info_sec col-12 col-lg-6'>

		                						<i className='fas fa-truck-moving' aria-hidden="true"></i>
		                						<span className='prodinfo_right_sect_title'>Livrare</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Oferim livrare gratuită pe teritoriul României pentru toate comenzile care depasesc 150 LEI. În cazul în care valoarea comenzii nu depășește 150 LEI, costurile de livrare vor fi incluse în preț, in functie de alegerea metodei de livrare.
		                						</span>

		                						<i className='fas fa-redo'></i>
		                						<span className='prodinfo_right_sect_title'>Returnari</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Pentru realizarea returului (returnarea comenzii) ai la dispoziție 30 de zile de la data primirii coletului. Nu uita să atașezi coletului factura sau bonul fiscal. Banii îți vor fi rambursați între 5 și 14 zile calendaristice de la confirmarea returului.
		                						</span>

		                						<i className='fas fa-question'></i>
		                						<span className='prodinfo_right_sect_title'>Intrebari despre produs</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Pentru orice întrebare despre produs, scrie-ne la <a href='mailto:contact@tdesign.ro'>contact@tdesign.ro</a> si iti vom raspunde in cel mai scurt timp.
		                						</span>


		                					</div>
		                				</div>
		                			</div>
		                		</div>
	                		</React.Fragment>
	                	 ):(
	                	 	<PageNotFound />
	                	 )}

	                	</div>
	                </div>
				</div>
		)
	 	 
	}
}
 
const ProductInfo = connect(mapStateToProps,mapDispatchToProps)(connectedProductInfo);
export default ProductInfo;

 