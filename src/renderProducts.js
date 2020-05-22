import React from 'react';
import './css/DisplayProductsContainer.css';
import objectProducts from './products';

function RenderProducts(props) {

	return (
			<div className='row justify-content-center'>

			<div className='col-12'>
				<span className='pl-4'>
					Showing {props.products.length} of {objectProducts.length}
				</span>
			</div>

			  {props.products.map((prod,ind) => 
		          <div key={ind} className='box'>
		          	<span className='new_product'>{prod.new ? 'NEW' : null}</span>
		            <span>Name: {prod.name}</span>
		            <span>Gender: {prod.gender}</span>
		            <span className='color_box' style={{backgroundColor:prod.color}}></span>
		            <div>
		              Material:
		              {prod.material.map((mat,ind) =>
		                <span key={ind}> {mat} </span> 
		              )}
		            </div>
		            
		            <span>Category: {prod.category}</span>
		            <span>Price: ${prod.price}</span>
		            <span>Size: {prod.size+""}</span>
		          </div>
         		)}
			</div>
		)
}

export default RenderProducts;