import React from 'react';
import Products                   from '../Products';
import   womenProductsData from '../../data/women';



class womenProducts extends React.Component {
	render() {
		return (
				<div>	
					  <Products 
					  	selectedProductsProps={womenProductsData} 
					  	totalSelProducts={womenProductsData}
					  	pathName='Tricouri femei'
					  />
				</div>
		)
	}
}

export default womenProducts;