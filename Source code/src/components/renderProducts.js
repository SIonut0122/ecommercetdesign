import   React               from 'react';
import { Link              } from 'react-router-dom';
import { connect           } from "react-redux";
import { setWishList       } from '../actions';
import { addProdToWishlist } from '../fauna/addProdToWishlist';
import '../css/Products.css';
 


const mapStateToProps = state => {
  return {  
          wishList       : state.wishList,
          userIsSignedIn : state.userIsSignedIn,
          userDbInfo     : state.userDbInfo
        };
};

function mapDispatchToProps(dispatch) {
  return {
          setWishList : products => dispatch(setWishList(products))
        };
}


class connectedRenderProducts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			products                  : props.products,
			checkedWishlistedProducts : true,
			currentPage               : 1,
			productsPerPage           : 15,
			loadingPage               : false
		}
	}


componentDidMount() {
	// When page loads, check which products are added to the wishlist and check them
	this.checkWishlistProducts(); 

	// Highlight first pagination number when page loads
	let pages = document.querySelectorAll('.page-link');
		pages.forEach(el => { if(parseFloat(el.innerHTML) === 1) { el.classList.add('pag_active')} });
}

componentDidUpdate(prevProps) {
	// Track the changes between received props and actual state and update the list to render again
	if(prevProps.products !== this.props.products) {
		this.setState({ products: this.props.products })
	}
	// When wishList and products loads, call function to check which product was added to wishlist
	if(this.props.wishList.length > 0 && this.props.products.length > 0 && this.state.checkedWishlistedProducts) {
		this.checkWishlistProducts();
		// Set this to false to stop calling this of every update
		this.setState({ checkedWishlistedProducts: false })
	}
}

checkWishlistProducts() {
	let products = [...this.state.products];
	// Collect all id's from the wishlist
	let wishListIds = this.props.wishList.map(el => el.id);
	// Map through products when page loads and compare id's with the wishlist and set to
		// true or false if the products was found inside wishlist
	setTimeout(() => {
		for(let p in products) {
			if(wishListIds.includes(products[p].id)) {
				products[p].addedToWishlist = true;
			} else {
				products[p].addedToWishlist = false;
			}
		}
		this.setState({ products: products })

	},500);
}

prodInfoHover(e,prod) {
	let products = [...this.state.products];
	// Find hovered product and set profile image the second indexed img
	for(let p in products) {
		if(prod.id === products[p].id) {
			// If moreImages has more than 1 image URLs, display the second img
			if(products[p].moreImages.length > 1) {
				products[p].img = products[p].moreImages[1];
			} 
		}
	}
	this.setState({ products: products })
}

prodInfoHoverOut(prod) {
	let products = [...this.state.products];
	// Find hovered product by id and restore profile image
	for(let p in products) {
		if(prod.id === products[p].id) {
			// Restore profile img only if moreImages contains more than 1 URLs
			if(products[p].moreImages.length > 1) {
				products[p].img = products[p].moreImages[0];
			} 
		}
	}
	this.setState({ products: products })
}

addProductToWishlist(e) {
	let products = [...this.state.products],
	    wishList = [...this.props.wishList];

	 // Map through products and search for the clicked id
	  for(let c in products) {
		if(products[c].id === e.id) {
			// If id match and addedToWishlist propriety is true, set to false and remove product from wishlist
			if(products[c].addedToWishlist) {
				products[c].addedToWishlist = false;
				 let removeProd = wishList.filter((p) => p.id !== e.id);
					 wishList = removeProd;
			} else {
				// Else, push the product to the wishlist
				products[c].addedToWishlist = true;
				wishList.push(e);
			}
		}
	}
	// Set new wishlist list and new product with the addedtowishlist set to true
	this.props.setWishList({ wishList })
	this.setState({ products })

	// If user is signed in, send wishlist to userDb info
	if(this.props.userIsSignedIn && this.props.userDbInfo !== null) {
	    // Collect id and wishlist inside an object
		let updatedWishlist = {id: this.props.userDbInfo.ref.value.id, wishlist: wishList};
	    // Call function to update userDb  is user is signed in
	    addProdToWishlist(updatedWishlist);
    } else {
    	// Set wishlist to localStorage
		localStorage.setItem('wishList', JSON.stringify(wishList));
    }
}

 /* Return clicked page / Highlight clicked page */
 returnPage(pageNumber,type) { 
	let currpage = 1;

	switch(type) {
		case 'prev':
			// If page number is not equal with 1, proceed to prev page
			if(this.state.currentPage !== 1) {
				currpage = this.state.currentPage - 1;
				this.setState({ loadingPage:true, currentPage: currpage })
			} else { return; }
		break;
		case 'next':
			// If page number is not equal with the last page number, proceed to next page
	    	let lastPageNo = pageNumber.slice(-1).pop()
	  		if(this.state.currentPage !== lastPageNo) {
	  			currpage = this.state.currentPage + 1;
	  			this.setState({ loadingPage:true, currentPage: currpage })
	  		} else { return; }
		break;
		default:
		currpage = pageNumber;
		this.setState({ loadingPage:true, currentPage: pageNumber })
	}
		// Disable page loading and hightlight pagination page number
		setTimeout(() => {
			this.setState({ loadingPage: false })
			// Map through all DOM pagination pages and find current page to be highlighted
			let pages = document.querySelectorAll('.page-link');
				pages.forEach(el => { 
					// If DOM page innerHTML number === currpage, highlight page.
					if(parseFloat(el.innerHTML) === currpage) {
						el.classList.add('pag_active');

						// Scoll to top on every page change
						window.scrollTo(0, 0);
					 	 
					} else {
						el.classList.remove('pag_active');
					}
				});
		},500);
	}


	render() {
		{/* Conts for pagination */}
		const indexOfLastProduct  = this.state.currentPage * this.state.productsPerPage,
			  indexOfFirstProduct = indexOfLastProduct - this.state.productsPerPage,
		      products            = this.state.products.slice(indexOfFirstProduct, indexOfLastProduct),
			  // Divide prooducts length by the products per page state, and push resulted pageNumbers to array
		      pageNumbers = [];
			  for(let i=1; i <= Math.ceil(this.state.products.length / this.state.productsPerPage); i++) {
				pageNumbers.push(i);
			  }


		return (
			<div>
				{/* If page number is higher than 1 , add padding to display 'Page 2 of n' properly */}
				<div className='dp_wrap_prod_wrapper' style={{paddingTop: this.state.currentPage > 1 ? '40px' : '0'}}>

				{/* Display loading while changing the page */}
				{this.state.loadingPage && (
				<span className='d_pc_dp_load_filder_modal'></span>
				)}

				{/* If page > 1, display 'Page n of n' text */}
				{this.state.currentPage > 1 && (
				<span className='dp_wrap_page_no'>Pagina <strong>{this.state.currentPage}</strong> din <strong>{pageNumbers.length}</strong></span>
				)}

				{/* Display products if there is any after pagination slicing */}
				{products.length > 0 ? (
					<React.Fragment>				
					    {products.map((prod,ind) => 
				          <div key={ind} className='d_product_card'>

				          	{/* Add / remove from wishlist icon - Render only if user is or not logged in. Avoid while loading prod and user, click on the fav icon and add prod to localStorage instead of userDb database */}
				          	{this.props.userIsSignedIn !== null && (
					          	<React.Fragment>
						          	{!prod.addedToWishlist ? (
						          		<i className='far fa-heart dprod_addtowishlist_btn prod_wishlist_btn' onClick={(e)=>this.addProductToWishlist(prod)}></i>
						          	):(
						          		<i className='fas fa-heart dprod_removefromwishlist_btn prod_wishlist_btn' onClick={(e)=>this.addProductToWishlist(prod)}></i>
						          	)}
					          	</React.Fragment>
				          	)}

				          	{/* Product image */}
				          	<Link to={`/productinfo/${prod.id}`} tabindex='0' className='prod_imgprof_link' onMouseOver={(e)=> this.prodInfoHover(e,prod)} onMouseLeave={(e)=> this.prodInfoHoverOut(prod)}>
				          		<img style={{opacity: prod.availableProductNo === 0 ? '0.6' : '1'}} src={prod.img} alt={prod.name} title={prod.name}/>
				          	</Link>

				          	{/* Product new icon */}
				          	{prod.new && (
				          	<span className='dprod_new_icon'>Nou!</span>
				          	)}
				          	
				          	{/* Product name */}
				          	<span className='dprod_c_name'>{prod.name}</span>
				            
				            {/* Product price / and old price (if offer) */}
				            {prod.availableProductNo === 0 ? (
				            	<span className='dprod_outofstock'>Stoc epuizat</span>
				            ) : (
				            <span className='dprod_c_price'>
				            	<span className='dprod_c_actprice'>{prod.price} LEI</span>
				            	{prod.oldPrice !== undefined && (
				            	<span className='dprod_c_oldprice'>{prod.oldPrice+' LEI'}</span>
				            	)}
				            </span>
				            )}

				        	{/* Product colors */}
				            <span className='dprod_c_colors'>
				            	{/* Display only first 3 colors */}	
				            	{prod.colors.map((color,ind) => 
				            		<React.Fragment>
				            		{ind <= 3 && (
				            		<span key={ind} className='dprod_avail_colors' style={{backgroundColor:color}}></span>
				            		)}
				            		</React.Fragment>
				            	)}
				             	
				             	{/* If available product colors exceed 3, display the rest as '+2' (totalColors - 3 = rest) */}
				             	<span className='dprodc_colors_morecolorsno'>
				            		{prod.colors.length > 5 && (
				             		<span>+{prod.colors.length - 4}</span>
				            		)}
				            	</span>
				            </span>

				          </div>
		         		)}
					 </React.Fragment>
					 
					  
				):(	
					 <div className='wrap_prod_noresults_msg'>
					 	{/* DISPLAY 'NO PRODUCTS TO SHOW' MESSAGE */}
					 	<span>Ne pare rău. Nu am găsit niciun rezultat.</span>
					 </div>
				)}
			 	</div>

		 		{/* Pagination */}
		 		<div className='row justify-content-center'>
		 			<div className='rp_wrap_pagination'>

		 				 <div className='row'>
						<nav>
							<ul className='pagination'>
								<li className='page-item'>
							      <span className='page-link page_link_arrow' tabindex='0' onClick={() => this.returnPage(pageNumbers, 'prev')}>
							        <span aria-hidden='true'>&laquo;</span>
							      </span>
							    </li>

								{pageNumbers.map(pageNo => (
									<li key={pageNo} className='page-item'>
									<span onClick={() => this.returnPage(pageNo)} tabindex='0' href='!#' className='page-link'>
									{pageNo}
									</span>
									</li>
								))}

								 <li className='page-item'>
							      <span className='page-link page_link_arrow' tabindex='0' onClick={() => this.returnPage(pageNumbers,'next')}>
							        <span aria-hidden='true'>&raquo;</span>
							      </span>
							    </li>
							</ul>
						</nav>
						</div>
					</div>
		 		</div>

			 </div>
		 
		)
	}
}

 
const RenderProducts = connect(mapStateToProps,mapDispatchToProps)(connectedRenderProducts);
export default RenderProducts;

 