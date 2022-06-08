import   React                   from 'react';
import   Products                from '../Products';
import   getAllChildrenProducts  from './getAllChildrenProducts';
import { client, q             } from '../../fauna/db';
import { connect               } from "react-redux";
import { setChildrenProductsDb } from '../../actions';

const mapStateToProps = state => {
  return {childrenProductsDataDb: state.childrenProductsDataDb };
};


function mapDispatchToProps(dispatch) {
  return { setChildrenProductsDb : childrenProdDb => dispatch(setChildrenProductsDb(childrenProdDb)) };
}


class connectedChildrenProducts extends React.Component {


	componentDidMount() {
		// Highlight this nav title menu
		document.querySelector('.nav_menu_children').setAttribute('style','background-color:#fff;color:#000;');

		// If menProducts props wasn't fetched, fetch data.
	 	 if(this.props.childrenProductsDataDb === null) {
	 	 	this.fetchChildrenProducts();
	 	 }
	 	 
	 	// Scoll to top on every mount
		window.scrollTo(0, 0);
	}
	
	componentWillUnmount() {
		document.querySelector('.nav_menu_children').removeAttribute('style');
	}

	async fetchChildrenProducts() {
		console.log('Fetchind children products data');
		let get = await getAllChildrenProducts
		.then((childrenProdData) => {
			// Collect inside menProductsData only menProds data
		     	let childrenProductsData = [];
		     	// Extract only data
		     	childrenProdData.forEach(el => { 
		     			el.data.refId = el.ref.value.id;
		     			childrenProductsData.push(el.data)
		     		});
		     	this.props.setChildrenProductsDb({ childrenProductsDataDb: childrenProductsData })
		})
		.catch((error) => console.log('Error while fetching data: ', error.message))
		 
	}


	render() {
		// While fetchind data, display loading effect
		if(this.props.childrenProductsDataDb === null) {
			return ( <div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					 </div>
					)
		}

		// If data was fetched, return products
		return (
				<div>	
					  <Products 
					  	selectedProductsProps = {this.props.childrenProductsDataDb} 
					  	totalSelProducts      = {this.props.childrenProductsDataDb}
					  	pathName              = 'Tricouri copii'
					  />
				</div>
		)
	}
}


const childrenProducts = connect(mapStateToProps,mapDispatchToProps)(connectedChildrenProducts);
export default childrenProducts;