import React from 'react';
import '../css/DisplayProductsContainer.css';
 
import logo2 from '../images/pants2.jpg';

 


function RenderProducts(props) {

	return (
			 
				<div className='dp_wrap_prod_wrapper'>

				{props.products.length > 0 ? (
					<React.Fragment>				
					    {props.products.map((prod,ind) => 
				          <div key={ind} className='d_product_card'>
				          	<span><img src={logo2} alt={prod.name} title={prod.name}/></span>

				          	<span className='dprod_c_name'>{prod.name}</span>
				            
				            <span className='dprod_c_price'>
				            	<span className='dprod_c_actprice'>{prod.price} LEI</span>
				            	<span className='dprod_c_oldprice'>45.99 LEI</span>
				            </span>

				            <span className='dprod_c_colors'>
				            	{prod.colors.map((color,ind) => 
				            	<React.Fragment>
				            	{ind <= 3 && (
				            	<span key={ind} className='dprod_avail_colors' style={{backgroundColor:color}}></span>
				            	)}
				            	</React.Fragment>
				            	)}
				             	
				             	<span className='dprodc_colors_morecolorsno'>
				            	{prod.colors.length > 5 && (
				             	<span>+{prod.colors.length - 4}</span>
				            	)}
				            	</span>
				            </span>
				          </div>
		         		)}
					 </React.Fragment>
				):(
					 <span className='wrap_prod_noresults_msg'>Ne pare rau. Nu am gasit niciun rezultat.</span>
				)}
			 	</div>
			 

		 
		)
}

 
export default RenderProducts;
 