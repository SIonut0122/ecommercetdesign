import React from 'react';
import Products                   from '../Products';
import   menProductsData from '../../data/men';



class menProducts extends React.Component {
	render() {
		return (
				<div>	
					  <Products 
					  	selectedProductsProps={menProductsData} 
					  	totalSelProducts={menProductsData}
					  	pathName='Tricouri barbati'
					  />
				</div>
		)
	}
}

export default menProducts;