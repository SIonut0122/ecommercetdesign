import React from 'react';
import Products             from '../Products';
import { setWomenProductsDb,setMenProductsDb, setNewProductsDb} from '../../actions';
import { client, q          } from '../../fauna/db';
import { connect            } from "react-redux";
import getAllWomenProducts from './getAllWomenProducts';
import getAllMenProducts from './getAllMenProducts';



const mapStateToProps = state => {
  return {
  			menProductsDataDb   : state.menProductsDataDb,
  			womenProductsDataDb : state.womenProductsDataDb,
  			newProductsDataDb   : state.newProductsDataDb
  		 };
};


function mapDispatchToProps(dispatch) {
  return { setWomenProductsDb : womenProdDb => dispatch(setWomenProductsDb(womenProdDb)),
  		   setMenProductsDb   : menProdDb   => dispatch(setMenProductsDb(menProdDb)),
  		   setNewProductsDb   : newProdDb   => dispatch(setNewProductsDb(newProdDb)) 
  		};
}


class connectedNewProducts extends React.Component {

 

	componentDidMount() {
		// Highlight this nav title menu	
		document.querySelector('.nav_menu_new').setAttribute('style','background-color:#fff;color:#000');
		// Fetch only if womenproducts and menproducts were not fetched
		if(this.props.newProductsDataDb === null) {
			this.fetchWomenProducts();
	 	}  
	 	
	 	// Scoll to top on every mount
		window.scrollTo(0, 0);
	}

	componentWillUnmount() {
		document.querySelector('.nav_menu_new').removeAttribute('style');
	}


	async fetchWomenProducts() {
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
		// If error returned, continue fetching
		  .catch((error) => { console.log('Error while fetching data: ', error.message); this.fetchMenProducts(); })
	}

	async fetchMenProducts() {
		let get = await  getAllMenProducts
		.then((resp) => {
				// Collect inside menProductsData only menProds data
		     	let menProductsData = [];
		     	resp.forEach(el => menProductsData.push(el.data));
		     	this.props.setMenProductsDb({ menProductsDataDb: menProductsData })
		     	// Set state to concat for results
		     	this.setState({ menProductsData })
		     	// Call function to concat all results and display only new products
		     	this.displayNewResults();
		})
		 // If error returned, continue displaynewresults with already fetched data
		  .catch((error) => { console.log('Error while fetching data: ', error.message); this.displayNewResults();})
	}


	displayNewResults() {
		let newResults = [],
			// Concat fetched data, filter only new elements and set new products order numbers
			concatNewResults = [...newResults, ...this.state.menProductsData, ...this.state.womenProductsData],
			// Get only new products
			getOnlyNewProducts = concatNewResults.filter(el => el.new);
			// Set order from  0 to getOnlyNewproducts.length;
			getOnlyNewProducts.forEach((el,ind) => el.pNo = ind);
			// Send new data to be displayed
			this.props.setNewProductsDb({ newProductsDataDb: getOnlyNewProducts })
	}

	render() {
		// While fetchind data, display loading effect
		if(this.props.newProductsDataDb === null) {
			return ( <div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					 </div>
					)
		}


		return (
				<div>	
					  <Products 
					  	selectedProductsProps = {this.props.newProductsDataDb} 
					  	totalSelProducts      = {this.props.newProductsDataDb}
					  	pathName              = 'Noutăți'
					  />
				</div>
		)
	}
}

const newProducts = connect(mapStateToProps,mapDispatchToProps)(connectedNewProducts);
export default newProducts;