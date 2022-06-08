import   React              from 'react';
import   Products           from '../Products';
import   getAllMenProducts  from './getAllMenProducts';
import { client, q        } from '../../fauna/db';
import { connect          } from "react-redux";
import { setMenProductsDb } from '../../actions';

const mapStateToProps = state => {
  return { menProductsDataDb: state.menProductsDataDb };
};


function mapDispatchToProps(dispatch) {
  return { setMenProductsDb : menProdDb => dispatch(setMenProductsDb(menProdDb)) };
}


class connectedMenProducts extends React.Component {


	componentDidMount() {
		// Highlight this nav title menu
		document.querySelector('.nav_menu_men').setAttribute('style','background-color:#fff;color:#000;');
		// If menProducts props wasn't fetched, fetch data.
	 	 if(this.props.menProductsDataDb === null) {
	 	 	this.fetchMenProducts();
	 	 }
	 	// Scoll to top on every mount
		window.scrollTo(0, 0);
	}
	
	componentWillUnmount() {
		document.querySelector('.nav_menu_men').removeAttribute('style');
	}

	async fetchMenProducts() {
		let get = await getAllMenProducts
		.then((menProdData) => {
			// Collect inside menProductsData only menProds data
		     	let menProductsData = [];
		     	// Extract only data
		     	menProdData.forEach(el => { 
		     			el.data.refId = el.ref.value.id;
		     			menProductsData.push(el.data)
		     		});
		     	this.props.setMenProductsDb({ menProductsDataDb: menProductsData })
		})
		.catch((error) => console.log('Error while fetching data: ', error.message))
		 
	}


	render() {
		// While fetchind data, display loading effect
		if(this.props.menProductsDataDb === null) {
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
					  	selectedProductsProps = {this.props.menProductsDataDb} 
					  	totalSelProducts      = {this.props.menProductsDataDb}
					  	pathName              = 'Tricouri bărbați'
					  />
				</div>
		)
	}
}


const menProducts = connect(mapStateToProps,mapDispatchToProps)(connectedMenProducts);
export default menProducts;