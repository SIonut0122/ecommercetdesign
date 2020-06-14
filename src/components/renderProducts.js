import React from 'react';
import '../css/Products.css';
 import { Link               } from 'react-router-dom';
import logo2 from '../images/pants2.jpg';
import { connect }            from "react-redux";
 import { setWishList } from '../actions';
 

const mapStateToProps = state => {
  return {  
          wishList   : state.wishList,
        };
};

function mapDispatchToProps(dispatch) {
  return {
          setWishList : products    => dispatch(setWishList(products))
        };
}



class connectedRenderProducts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			products: props.products,
			checkedWishlistedProducts: true
		}
	}


componentDidMount() {
	// When page loads, check which products are added to the wishlist and check them
	this.checkWishlistProducts(); 
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
			products[p].img = products[p].moreImages[1]; 
		}
	}
	this.setState({ products: products })
}

prodInfoHoverOut(prod) {
	let products = [...this.state.products];
	// Find hovered product by id and restore profile image
	for(let p in products) {
		if(prod.id === products[p].id) {
			products[p].img = products[p].moreImages[0]; 
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
	// Push wishlist to localstorage to be used on every mount
	localStorage.setItem('wishList', JSON.stringify(wishList));
}

	render() {

		return (
				<div className='dp_wrap_prod_wrapper'>

				{this.state.products.length > 0 ? (
					<React.Fragment>				
					    {this.state.products.map((prod,ind) => 
				          <div key={ind} className='d_product_card'>

				          	{!prod.addedToWishlist ? (
				          	<i className='far fa-heart dprod_addtowishlist_btn prod_wishlist_btn' onClick={(e)=>this.addProductToWishlist(prod)}></i>
				          	):(
				          	<i className='fas fa-heart dprod_removefromwishlist_btn prod_wishlist_btn' onClick={(e)=>this.addProductToWishlist(prod)}></i>
				          	)}

				          	<Link to={`/productinfo/${prod.id}`} onMouseOver={(e)=> this.prodInfoHover(e,prod)} onMouseLeave={(e)=> this.prodInfoHoverOut(prod)}>
				          		<img src={prod.img} alt={prod.name} title={prod.name}/>
				          	</Link>

				          	<span className='dprod_c_name'>{prod.name}</span>
				            
				            <span className='dprod_c_price'>
				            	<span className='dprod_c_actprice'>{prod.price} LEI</span>
				            	<span className='dprod_c_oldprice'>{prod.oldPrice !== null ? prod.oldPrice+' LEI' : ''}</span>
				            </span>

				            <span className='dprod_c_colors'>
				            	{prod.colors.map((color,ind) => 
				            	<React.Fragment>
				            	{ind <= 3 && (
				            	<span key={ind} className='dprod_avail_colors' style={{backgroundColor:color}}></span>
				            	)}
				            	</React.Fragment>
				            	)}
				             	
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
					 <span className='wrap_prod_noresults_msg'>Ne pare rau. Nu am gasit niciun rezultat.</span>
				)}
			 	</div>
			 

		 
		)
	}
}

 
const RenderProducts = connect(mapStateToProps,mapDispatchToProps)(connectedRenderProducts);
export default RenderProducts;

 