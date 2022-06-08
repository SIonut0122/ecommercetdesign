import   React                from 'react';
import   Products             from '../Products';
import { client, q          } from '../../fauna/db';
import { connect            } from "react-redux";
import { setWomenProductsDb } from '../../actions';
import   getAllWomenProducts  from './getAllWomenProducts';
 

const mapStateToProps = state => {
  return { womenProductsDataDb: state.womenProductsDataDb };
};


function mapDispatchToProps(dispatch) {
  return { setWomenProductsDb : womenProdDb => dispatch(setWomenProductsDb(womenProdDb)) };
}


class connectedWomenProducts extends React.Component {

	componentDidMount() {
		// Highlight this nav title menu
		document.querySelector('.nav_menu_women').setAttribute('style','background-color:#fff;color:#000');

		// If womenProducts props wasn't fetched, fetch data.
	 	 if(this.props.womenProductsDataDb === null) {
	 	 	this.fetchWomenProducts();
	 	 }

	 	// Scoll to top on every mount
		window.scrollTo(0, 0);
	}

	componentWillUnmount() {
		document.querySelector('.nav_menu_women').removeAttribute('style');
	}

	async fetchWomenProducts() {
		console.log('Fetchind women products data');
		
		let get = await getAllWomenProducts
		.then((womenProdData) => {
			// Collect inside womenProductsData only womenProds data
		     	let womenProductsData = [];
		     	// Extract only data
		     	womenProdData.forEach(el => { 
		     			el.data.refId = el.ref.value.id;
		     			womenProductsData.push(el.data)
		     		});
		     	this.props.setWomenProductsDb({ womenProductsDataDb: womenProductsData })
		})
		.catch((error) => console.log('Error while fetching data: ', error.message))

	}

	render() {

		// While fetchind data, display loading effect
		if(this.props.womenProductsDataDb === null) {
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
					  	selectedProductsProps={this.props.womenProductsDataDb} 
					  	totalSelProducts={this.props.womenProductsDataDb}
					  	pathName='Tricouri femei'
					  />
				</div>
		)
	}
}

const womenProducts = connect(mapStateToProps,mapDispatchToProps)(connectedWomenProducts);
export default womenProducts;