import   React                    from 'react';
import { connect                } from "react-redux"; 
import { setMenProductsDb, 
		 setWomenProductsDb, 
		 setChildrenProductsDb, 
		 setSearchInput         } from '../actions';
import   Products                 from './Products';
import   getAllWomenProducts 	  from './products/getAllWomenProducts';
import   getAllMenProducts   	  from './products/getAllMenProducts';
import   getAllChildrenProducts   from './products/getAllChildrenProducts';
 

const mapStateToProps = state => {
  return { 
  		   menProductsDataDb      : state.menProductsDataDb,
  		   womenProductsDataDb    : state.womenProductsDataDb,
  		   childrenProductsDataDb : state.childrenProductsDataDb
  		};
};


function mapDispatchToProps(dispatch) {
  return {  
  			setMenProductsDb      : menProdDb      => dispatch(setMenProductsDb(menProdDb)),
  			setWomenProductsDb    : womenProdDb    => dispatch(setWomenProductsDb(womenProdDb)),
  			setChildrenProductsDb : childrenProdDb => dispatch(setChildrenProductsDb(childrenProdDb)),
  			setSearchInput        : inputValue     => dispatch(setSearchInput(inputValue))
  		};
}


class connectedSearchProducts extends React.Component {
	  constructor(props) {
    	super(props)

    	this.state = {
    		searchResulted       : false,
 			resultedProducts     : null,
 			menProductsData      : null,
 			womenProductsData    : null,
 			childrenProductsData : null
    	}
	}

componentDidMount() {
   // Call function to render products with typed input id
   this.fetchWomenProducts();

   // Set document title
   document.title = 'Rezultate: '+this.props.match.params.id+' | TDesign';
 }

componentDidUpdate(prevProps) {
	// If pathname changes, call function and set searchResulted to false to rerender
	if(prevProps.location.pathname !== this.props.location.pathname) {
		this.setState({ searchResulted: false })
		this.fetchWomenProducts();
	} 
}

componentWillUnmount() {
	this.props.setSearchInput({ searchInput: ''})
}

async fetchWomenProducts() {
	// Collect all women products
		let get = await getAllWomenProducts
		.then((resp) => {
			console.log('women prod done');
				// Collect inside womenProductsData only womenProds data
		     	let womenProductsData = [];
		     	resp.forEach(el => womenProductsData.push(el.data));
		     	this.props.setWomenProductsDb({ womenProductsDataDb: womenProductsData })
		     	// Set state to concat
		     	this.setState({ womenProductsData })
		     	// Call second function to collect men products too
		     	this.fetchMenProducts();
		})
		// If error returned, continue with second function
		  .catch((error) => { console.log('Error while fetching data: ', error.message); this.fetchMenProducts(); })
}

async fetchMenProducts() {
	// Collect all men products
	let get = await getAllMenProducts
	.then((resp) => {
			// Collect inside menProductsData only menProds data
	     	let menProductsData = [];
	     	resp.forEach(el => menProductsData.push(el.data));
	     	this.props.setMenProductsDb({ menProductsDataDb: menProductsData })
	     	// Set state to concat for results
	     	this.setState({ menProductsData })
	     	
	     	this.fetchChildrenProducts();
	})
	 // If error returned, continue displaynewresults with already fetched data
	  .catch((error) => { console.log('Error while fetching data: ', error.message); this.fetchChildrenProducts()})
}

async fetchChildrenProducts() {
	// Collect all men products
	let get = await getAllChildrenProducts
	.then((resp) => {
			// Collect inside menProductsData only menProds data
	     	let childrenProductsData = [];
	     	resp.forEach(el => childrenProductsData.push(el.data));
	     	this.props.setChildrenProductsDb({ childrenProductsDataDb: childrenProductsData })
	     	// Set state to concat for results
	     	this.setState({ childrenProductsData })
	     	// Call function to concat all results and display only new products
	     	this.renderProd();	     		

	})
	 // If error returned, continue displaynewresults with already fetched data
	  .catch((error) => { console.log('Error while fetching data: ', error.message); this.renderProd();})
}

renderProd() {
	// Concat all products data inside one array 
	let newArray = [],
		totalProducts = [...newArray, ...this.state.menProductsData, ...this.state.womenProductsData, ...this.state.childrenProductsData],
		// Map through all products and search inside title if contains typed query id
		resultedProducts = totalProducts.filter((prod) => prod.name.toLowerCase().includes(this.props.match.params.id.toLowerCase()));	 	 
      
      	this.props.setSearchInput({ searchInput: this.props.match.params.id})
     	this.setState({ resultedProducts, searchResulted: true })	 
 }


 


	render() {

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

 

const searchProducts = connect(mapStateToProps,mapDispatchToProps)(connectedSearchProducts);
export default searchProducts;