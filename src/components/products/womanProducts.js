import React from 'react';
import Products                   from '../Products';
import   womanProductsData from '../../data/womans';



class womanProducts extends React.Component {
	render() {
		return (
				<div>	
					  <Products 
					  	selectedProductsProps={womanProductsData} 
					  	totalSelProducts={womanProductsData}
					  	pathName='Tricouri femei'
					  />
				</div>
		)
	}
}

export default womanProducts;