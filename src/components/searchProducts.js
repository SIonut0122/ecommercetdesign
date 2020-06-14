import React                 from 'react';

import Products              from './Products';
import menProductsData       from '../data/men';
import womenProductsData     from '../data/women';
 

 

class searchProducts extends React.Component {
	  constructor(props) {
    	super(props)

    	this.state = {
    		searchResulted: false,
 			resultedProducts: null,
    	}
	}

componentDidMount() {
   // Call function to render products with typed input id
   this.renderProd();
 }

componentDidUpdate(prevProps) {
	// If pathname changes, call function and set searchResulted to false to rerender
	if(prevProps.location.pathname !== this.props.location.pathname) {
		this.setState({ searchResulted: false })
		this.renderProd();
	} 
}
 
renderProd() {
	// Concat all products data inside one array 
	let newArray = [],
		totalProducts = [...newArray, ...menProductsData, ...womenProductsData],
		// Map through all products and search inside title if contains typed query id
		resultedProducts = totalProducts.filter((prod) => prod.name.toLowerCase().includes(this.props.match.params.id));	 	 
      
     	this.setState({ resultedProducts })
     	// Set searchResulted to true with 1 sec delay to render results
     	setTimeout(() => {
      		this.setState({ searchResulted: true })
     	},1000)
 }


 


	render() {
  		
  		document.title = 'Rezultate: '+this.props.match.params.id+' | Tshirtdesign';

		return (
			<div>	
				{this.state.searchResulted ? (
					 <Products
					 	selectedProductsProps = {this.state.resultedProducts}
						pathName              = {this.props.match.params.id}
						searchResulted        = {this.state.searchResulted}
					 />
						
			 	 ):(
			 	 	<div className='search_loading_eff'>
						<div className='acc_load_mod'><div></div><div></div><div></div><div></div></div>
						<span className='slef_search_title'>Cautare:</span>
						<span className='slef_search_key'>"{this.props.match.params.id}"</span>
			 	 	</div>
			 	)}
			</div>
			
		)
	}
}

export default searchProducts;