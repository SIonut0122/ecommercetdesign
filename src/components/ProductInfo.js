import React from 'react';
import { Link ,Redirect                 } from 'react-router-dom';
import { FacebookShareButton  } from 'react-share';
import logo2 from '../images/pants2.jpg';
import '../css/ProductInfo.css';
import   menProductsData from '../data/men';
import   womanProductsData from '../data/womans';
import PageNotFound             from './Pagenotfound';

class ProductInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pathNameId: props.match.params.id,
			productInfo: null,
			productInfoFound: null,
			addedToWishList: false,
			addedToWishListMsg: null,
			selectedSize: '',
			selectSizeErrMsg: false,
			selectedColor: '',
			selectColorErrMsg: false,

		}

}

componentDidMount() {
	// Search a product with the desired url id
	 this.displayProductInfo();
}

componentDidUpdate(prevProps) {
	// Listen to params url id changes and if prevState id !== this.id, call function
	if(prevProps.match.params.id !== this.props.match.params.id) {
		this.displayProductInfo();
	}
}

displayProductInfo() {
  // Combine all products objects data into one array
  let newArray        = [],
      allProductsData = [...newArray, ...menProductsData, ...womanProductsData];
  // Loop through all products for the URL PARAM ID and get products info
 	for(let p in allProductsData) {
 		if(allProductsData[p].id === this.props.match.params.id) {
 			console.log(allProductsData[p]);
 			this.setState({ productInfoFound: true, productInfo: allProductsData[p] })
 			break;
 		}  else {
 			this.setState({ productInfoFound: false })
 		}
 	}
}

handleProdInfoMoreImg(e) {
	// Highlight clicked image
	const moreImgGallery = document.querySelectorAll('.pinfo_moreimg_gallery');
		  moreImgGallery.forEach((img) => img.setAttribute('style','2px solid transparent'));
		  e.target.style.border = '2px solid #202020';
}

handleSelectColor(e) {
	// Highlight clicked color box
	const productColors = document.querySelectorAll('.prodinfo_color_value');
		  productColors.forEach((color) => color.style.border = '1px solid #C6C6C6');
		  e.target.style.border = '3px solid #007bff';
		  // Set selected color
		  this.setState({ selectedColor: 'caca' })
}
handleSelectSize(e) {
		  // Highlight clicked size box
	const productSizes = document.querySelectorAll('.prodinfo_wrsizes_sizevalue');
		  productSizes.forEach((size) => { size.style.border = '2px solid #C6C6C6';size.style.color = 'inherit'; });
		  e.target.style.border = '2px solid #007bff';
		  e.target.style.color = ' #007bff';
		  // Set selected color
		  this.setState({ selectedSize: e.target.innerHTML })
}

prodInfoAddToWishlistBtn(e,bol) {
	let addedToWishlistMsg = document.querySelector('.prodinfo_addedtowishlist_msg');

	if(bol) {
		  // If bol is true, set state to display full heart svg icon
		  this.setState({ addedToWishList: true })
		  // Set innerHTML text on the 'added to wishlist' message and animate it
		  addedToWishlistMsg.innerHTML = 'Produsul a fost adaugat in wishlist';
		  addedToWishlistMsg.style.width = '100%';
 		  // Give delay of 250 milisec to render the red heart svg button and add to it this class to dezactivate it for 3 sec to leave time to display the msg
 		  setTimeout(() => { document.querySelector('.addto_wsh_full').classList.add('addtowish_bnt_inactive'); },250);
 		  setTimeout(() => { document.querySelector('.addto_wsh_full').classList.remove('addtowish_bnt_inactive');},3200);
	} else {
		  // Same thing as above /\ but reversed
		  this.setState({ addedToWishList: false })
		  addedToWishlistMsg.style.width = '100%'; 
		  addedToWishlistMsg.innerHTML = 'Produsul a fost sters din wishlist';
		  setTimeout(() => { document.querySelector('.addto_wsh_empty').classList.add('addtowish_bnt_inactive');},250);
		  setTimeout(() => { document.querySelector('.addto_wsh_empty').classList.remove('addtowish_bnt_inactive');},3200);
	}
		  // Hide 'added to wishlist/remove from wishlist' every time after 3 sec
 		  setTimeout(() => { addedToWishlistMsg.style.width = '0'},3000);
}

prodInfoAddToCart(e) {

	if(this.state.selectedSize.length > 0) {
		this.setState({ selectSizeErrMsg: false })
		if(this.state.selectedColor.length > 0) {
			this.setState({ selectColorErrMsg: false })
				
				// Disable 'Add to cart' button for 2 seconds
			e.target.setAttribute('style','opacity:0.8;pointer-events:none');
			setTimeout(() => {
				// Remove style from add to cart btn to activate it again
				document.querySelector('.prodinfo_addtocart_bnt').removeAttribute('style');
				document.querySelector('.pinf_addtocart_txt').innerHTML = 'Adăugat în coș';
				// Animate bag icon from 'Add to cart' button
				document.querySelector('.addtocart_i_bag').classList.add('addtocart_i_grow');
			},2000);
				// Remove classname which animate the icon bag from 'Add to cart' btn
			setTimeout(() => {document.querySelector('.addtocart_i_bag').classList.remove('addtocart_i_grow');},2300)

		} else {
			this.setState({ selectColorErrMsg: true })
		}
	} else {
		this.setState({ selectSizeErrMsg: true })
	}
}


	render() {
		 
		return (
				<div>
					{/* Navigation */}
	                <div className='row justify-content-center'>
		                <div className='nav_path_cont col-11'>
		                 <span>
		                 	<Link to={'/'} className='nav_path_home'>
		                  	Acasa 
		                  	</Link>
		                  	/ 
		                  	Conectare
		                  </span>
		                </div>    
	                </div>

	                <div className='row justify-content-center'>
	                	<div className='productinfo_container col-11'>

	                	{/* Display loading effect while fetching data */}
	                	{this.state.productInfoFound === null && (
	                		<div className='prodinfo_load_cont'><div></div><div></div><div></div><div></div></div>
	                	)}

	                	{/* If data was found, display product */}
	                	{this.state.productInfoFound ? (
	                		<React.Fragment>
		                		<div className='row justify-content-center'>
		                			<div className='prodinfo_sec_img prodinfo_section col-12 col-lg-6'>
		                				<img className='prodinfo_img_prof' src={logo2} alt=''/>
		                				<div className='prodinfo_sec_img_gallery'>
		                					<img src={logo2} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e)}/>
		                					<img src={logo2} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e)}/>
		                					<img src={logo2} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e)}/>
		                					<img src={logo2} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e)}/>
		                					<img src={logo2} className='pinfo_moreimg_gallery' alt='' onClick={(e)=>this.handleProdInfoMoreImg(e)}/>
		                				</div>
		                			</div>
		                			<div className='prodinfo_info_sec prodinfo_section col-12 col-lg-6'>
		                			 
		                				<span className='prodinfo_addedtowishlist_msg'></span>
		                				 
		                				<div className='prodinfo_prod_title'>
		                					{this.state.productInfo.name}
		                				 	{this.state.addedToWishList ? (
		                				 		<svg onClick={(e)=>this.prodInfoAddToWishlistBtn(e,false)} className="bi bi-heart-fill addto_wsh_full" width="1em" height="1em" viewBox="0 0 16 16" fill="#FF3E3E" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
												</svg>
		                				 	):(
		                				 		<svg onClick={(e)=>this.prodInfoAddToWishlistBtn(e,true)} className="bi bi-heart addto_wsh_empty" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
												  <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
												</svg>
		                				 	)}
		                				</div>
		                				<span className='prodinfo_prod_modelno'>Numar model: {this.state.productInfo.id}</span>

		                				<span className='prodinfo_prod_price'>{this.state.productInfo.price} LEI</span>

		                				<span className='prodinfo_prod_color_title'>Culoare</span>
		                				<div className='prodinfo_prod_wrap_colors'>
		                					{this.state.productInfo.colors.map((color,ind) =>
		                					<span key={ind} className='prodinfo_color_value' style={{backgroundColor: color}} onClick={(e)=>this.handleSelectColor(e)}></span>
		                					)}
		                				</div>
		                				{this.state.selectColorErrMsg && (
		                				<span className='prodinfo_err_msg'>Selecteaza culoarea</span>
		                				)}

		                				{/* Sizes */}
		                				<span className='prodinfo_prod_size_title'>Marime</span>
		                				<div className='prodinfo_prod_wrap_sizes'>
		                					{this.state.productInfo.size.map((size,ind) =>
		                					<span key={ind} className='prodinfo_wrsizes_sizevalue' onClick={(e)=>this.handleSelectSize(e)}>{size}</span>
		                					)}
		                				</div>
		                				{this.state.selectSizeErrMsg && (
		                				<span className='prodinfo_err_msg'>Selectează mărimea</span>
		                				)}

	                               		{/* Add to cart button */}
		                				<span className='prodinfo_addtocart_bnt' onClick={(e)=>this.prodInfoAddToCart(e)}>
		                					<i className='fas fa-shopping-bag addtocart_i_bag' aria-hidden='true'></i>
		                					<span className='pinf_addtocart_txt'>Adaugă în coș</span>
		                				</span>

		                				{/* Share product button */}
		                				<FacebookShareButton url       = {window.location.href}
	                                                         quote     = {'Check out this awesome product! :)'} 
	                                                         className = 'prodinfo_prod_sharefb'>
	                                       <i className='fas fa-share-alt'></i>Distribuie pe Facebook
	                                   </FacebookShareButton>
		                			</div>
		                		</div>
		                		<div className='row justify-content-center'>
		                			<div className='productinfo_aboutprod_info col-12'>
		                				<span className='pi_ap_i_sep col-12'></span>
		                				<div className='row justify-content-center'>
		                					<div className='prodinfo_aboutprod_info_sec col-12 col-lg-6'>
		                						<span className='pinfo_aboutp_info_title'>Despre produs</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Marime</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.ro.Marime}</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Descriere</span>
		                						<span className='pinfo_aboutp_info_descr'>Negru / rosu / verde</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.name}</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Stil</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.ro.Model}</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Compozitie</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.ro.Compozitie}</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Imprimeu</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.ro.Imprimeu}</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Instrucţiuni de întreţinere</span>
		                						<span className='pinfo_aboutp_info_descr'>Spălare la maşină la 40°</span>
		                						<span className='pinfo_aboutp_info_descr'>Nu folosiţi întălbitor</span>

		                						<span className='pinfo_aboutp_info_subtitle'>Număr articol</span>
		                						<span className='pinfo_aboutp_info_descr'>{this.state.productInfo.id}</span>
		                					</div>
		                					<div className='prodinfo_aboutprod_info_sec col-12 col-lg-6'>

		                						<i className='fas fa-truck-moving' aria-hidden="true"></i>
		                						<span className='prodinfo_right_sect_title'>Livrare</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Oferim livrare gratuită pe teritoriul României pentru toate comenzile care depasesc 150 LEI. În cazul în care valoarea comenzii nu depășește 150 LEI, costurile de livrare vor fi incluse în preț, in functie de alegerea metodei de livrare.
		                						</span>

		                						<i className='fas fa-redo'></i>
		                						<span className='prodinfo_right_sect_title'>Returnari</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Pentru realizarea returului (returnarea comenzii) ai la dispoziție 30 de zile de la data primirii coletului. Nu uita să atașezi coletului factura sau bonul fiscal. Banii îți vor fi rambursați între 5 și 14 zile calendaristice de la confirmarea returului.
		                						</span>

		                						<i className='fas fa-question'></i>
		                						<span className='prodinfo_right_sect_title'>Intrebari despre produs</span>
		                						<span className='prodinfo_right_sect_subtitle'>
		                							Pentru orice intrebare despre produs, scrie-ne la <a href='mailto:contact@tdesign.ro'>contact@tdesign.ro</a> si iti vom raspunde in cel mai scurt timp.
		                						</span>


		                					</div>
		                				</div>
		                			</div>
		                		</div>
	                		</React.Fragment>
	                	 ):(
	                	 	<PageNotFound />
	                	 )}

	                	</div>
	                </div>
				</div>
		)
	 	 
	}
}

export default ProductInfo;