import   React                    from 'react';
import   getAllWomenProducts      from '../products/getAllWomenProducts';
import   getAllMenProducts        from '../products/getAllMenProducts';
import   getAllChildrenProducts   from '../products/getAllChildrenProducts';
import { client, q              } from '../../fauna/db';
import { connect                } from "react-redux";
import { Link, Redirect         } from 'react-router-dom'
import '../../css/Dashboard.css';


const mapStateToProps = state => {
  return {  
  		  userIsSignedIn   : state.userIsSignedIn,
  		  userDbInfo       : state.userDbInfo
        };
};


class connectedAddProduct extends React.Component {

	state = {
		newUrlProductGallery     : '',
		productColorsList        : ['white','black','brown','silver','red','yellow','gold','orange','azure','blue','navy','gray','khaki','lightgreen','green','coral','purple','pink','fuchsia'],
		addNewColor              : '',
		addNewURLColor           : '',
		productSizeList          : ['XXS','XS','S','M','L','XL','XXL','3XL'],
		productNecktypeList      : [{neckTypeEng: 'roundneck', neckTypeRo: 'Guler rotund'},{neckTypeEng: 'vneck', neckTypeRo: 'decolteu in V'},{neckTypeEng: 'withcollar', neckTypeRo: 'Cu guler'},{neckTypeEng: 'hooded', neckTypeRo: 'Cu glugă'}],
		newProdTypeDescr         : '',
		newProdDescr             : '',
		addProductConfMsg        : false,
		addProductErrMsg         : false,
		product: {
			"pNo"                : 0,
			"id"                 :"",
			"availableProductNo" : '',
			"category"           : "",
			"new"                : false,
			"name"               : "",
			"price"              : 0,
			"oldPrice"           : null,
			"img"                : "",
			"moreImages"         : [],
			"color"              : '',
			"moreColors"         : [],
			"colors"             : [],
			"print"              : "",
			"material"           : [],
			"size"               : [],
			"necktype"           : [],
			"ro"                 : []
		},
	}

componentDidMount() {
	// Hide header
   	document.querySelector('.header_container').setAttribute('style','display:none !important;');
    document.querySelector('.main_container').setAttribute('style','margin-top:0 !important;');
}

/* ADD PRODUCT GALLERY */

addUrlProductGallery(e) {
	// Set new url while changing
	this.setState({ newUrlProductGallery: e.target.value })
}

addUrlProductGalleryBtn() {
	let imageGallery         = [...this.state.product.moreImages],
		newUrlProductGallery = this.state.newUrlProductGallery;

		if(newUrlProductGallery.length > 0) {
			imageGallery.push(newUrlProductGallery);

			this.setState(prevState => ({
				product: {
					...prevState.product,
					img: imageGallery[0],
					moreImages: imageGallery
					},
				newUrlProductGallery: ''
			}))
		}
}

removeProductGalleryImg(index) {
	let imageGallery = this.state.product.moreImages;
	this.setState(prevState => ({
			product: {
				...prevState.product,
				moreImages: this.state.product.moreImages.filter(el => this.state.product.moreImages.indexOf(el) !== index)
				}
		}))
}

addProductName(e) {
	let productName = e.target.value;
	this.setState(prevState => ({ product: {...prevState.product, name: productName} }))
}

/* ADD PRODUCT ID */

addProductId(e) {
	let newId = e.target.value;
	this.setState(prevState => ({ product: { ...prevState.product, id: newId } }))
}

addAvailProdNo(e) {
	let availProdNo = e.target.value;
	this.setState(prevState => ({ product: { ...prevState.product, availableProductNo: availProdNo } }))
}

addCategory(e) {
	let category = e.target.value;
	let cat = '';
	if(category === 'Barbati') {
		cat = 'men';
	} else if(category === 'Femei') {
		cat = 'women';
	} else {
		cat = 'children';
	}

	// Set subcategory null if category !== 'children'
	this.setState(prevState => ({ product: {...prevState.product, 
			category    : cat,
			subcategory : cat !== 'children' ? null : this.state.product.subcategory  
		}}))
}

addSubCategory(e) {
	let subcategory = e.target.value;
	let cat = '';
	if(subcategory === 'Baieti') {
		cat = 'boys';
	} else if(subcategory === 'Fete') {
		cat = 'girls';
	} else {
		cat = 'unisex';
	}

	let product = {...this.state.product};
		product.subcategory = cat;
		this.setState({ product })
}

addProductNew(e) {
	let productIsNew;
	if(e.target.value === 'Nu') {
		productIsNew = false;
	} else if(e.target.value === 'Da') {
		productIsNew = true;
	} else {
		productIsNew = '';
	}
	this.setState(prevState => ({ product: { ...prevState.product, new: productIsNew } }))
}

addProductPrice(e) {
	let price = e.target.value;
	this.setState(prevState => ({ product: {...prevState.product, price: price } }))
}

addProductOldPrice(e) {
	let oldPrice = e.target.value;
	this.setState(prevState => ({ product: {...prevState.product, oldPrice: oldPrice } }))
}

setProductColor(color) {
	let productColor = color;
	this.setState(prevState => ({ product: {...prevState.product, color: productColor } }))
}

removeMoreColors(index) {
	let productMoreColors = this.state.product.moreColors;
	// Remove clicked URL color by index
  	 this.setState(prevState => ({
		product: {
			...prevState.product,
			moreColors: this.state.product.moreColors.filter(el => this.state.product.moreColors.indexOf(el) !== index)
		}
	}))
		
 	}

addMoreColors(e,actionType) {
	// On change, check actionType, if user is typing on color input or url color input and update state
	if(actionType === 'color') {
		let newColor = e.target.value.toLowerCase();
		this.setState({ addNewColor: newColor })
	} else {
		let newURLColor = e.target.value;
		this.setState({ addNewURLColor: newURLColor })
	}
}

addMoreColorsBtn() {
	// Use value from URL Color input to create new color product with URL
	let moreColors    = [...this.state.product.moreColors];
	let newColor      = {};
	newColor['color'] = this.state.addNewColor;
	newColor['url']   = this.state.addNewURLColor;

	moreColors.push(newColor);
	// If newcolor and newurl is not empty, and color is found inside colors list, set it
	if(this.state.addNewURLColor.length > 0 && this.state.addNewColor.length > 0) {
		if(this.state.productColorsList.includes(this.state.addNewColor)) {
			// Push new added color intro colors array. Used for filter
			let colors = [...this.state.product.colors];
			// If new added color is not found inside colors, push it
				moreColors.forEach(el => {
					if(!colors.includes(el.color)) {
						colors.push(el.color);
					}
				});

			this.setState(prevState => ({
				product: {
					...prevState.product,
					moreColors: moreColors,
					colors: colors
				},
				addNewURLColor: '',
				addNewColor: ''
			}))
		}
	}
}

addProductPrint(e) {
	let print = '';

	if(e.target.value === 'Grafic') {
		print = 'graphic';
	} else if(e.target.value === 'Mesaj') {
		print = 'message';
	} else {
		print = ''
	}
	this.setState(prevState => ({ product: {...prevState.product, print: print } }))
}

/* _____ Update product material  _____ */

removeProductMaterial(index) {
	let productMaterial = this.state.product.material;
	// Remove clicked URL color by index
  	this.setState(prevState => ({
		product: {
			...prevState.product,
			material: productMaterial.filter(el => productMaterial.indexOf(el) !== index)
		}
	}))
}

addProductMaterial(material) {
	let productMaterial = [...this.state.product.material];
	// If product material doesn't include clicked material,push to material product
	if(!productMaterial.includes(material)) {
		productMaterial.push(material);
		this.setState(prevState => ({
			product: {
				...prevState.product,
				material: productMaterial
			}
		}))
	}
}

/* _____ Update product size  _____ */

removeProductSize(index) {
	let productSize = this.state.product.size;
	// Remove clicked size
  	this.setState(prevState => ({
		product: {
			...prevState.product,
			size: productSize.filter(el => productSize.indexOf(el) !== index)
		}
	}))
}

addProductSize(size) {
	let productSize = [...this.state.product.size];
	// If product size doesn't include clicked material,push to material product
	if(!productSize.includes(size)) {
		productSize.push(size);
		this.setState(prevState => ({
			product: {
				...prevState.product,
				size: productSize
			}
		}))
	}
}

/* _____ Update product necktype  _____ */

removeProductNecktype(index) {
	let productNecktype = this.state.product.necktype;
	// Remove clicked necktype
  	this.setState(prevState => ({
		product: {
			...prevState.product,
			necktype: productNecktype.filter(el => productNecktype.indexOf(el) !== index)
		}
	}))
}

addProductNecktype(necktype) {
	let productNecktype = [...this.state.product.necktype];
	// If product necktype doesn't include clicked necktype,push to necktype product
	if(!productNecktype.includes(necktype)) {
		productNecktype.push(necktype);
		this.setState(prevState => ({
			product: {
				...prevState.product,
				necktype: productNecktype
			}
		}))
	}
}

removeProductRoDescr(index) {
	let productRoDescr = this.state.product.ro;
	// Remove clicked ro description
  	this.setState(prevState => ({
		product: {
			...prevState.product,
			ro: productRoDescr.filter(el => productRoDescr.indexOf(el) !== index)
		}
	}))
}

addNewProdTypeDescr(e,actionType) {
	if(actionType === 'type') {
		this.setState({ newProdTypeDescr: e.target.value })
	} else {
		this.setState({ newProdDescr: e.target.value })
	}
}

addNewProdTypeDescrBtn() {
	let prodRoDescr  = [...this.state.product.ro],
		newProdDescr = {};

		if(this.state.newProdTypeDescr.length > 0 && this.state.newProdDescr.length > 0) {
			newProdDescr['type']  = this.state.newProdTypeDescr;
			newProdDescr['descr'] = this.state.newProdDescr;
			prodRoDescr.push(newProdDescr);

			this.setState(prevState => ({
				product: {
					...prevState.product,
					ro: prodRoDescr
				},
				newProdTypeDescr: '',
				newProdDescr: ''
			}))
		}
}

addNewProductBtn() {
	// Get date and time when the produc was added
	let today     = new Date(),
    	todayDate = today.getDate()  + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
  		time      = today.getHours() + ":" + today.getMinutes();

	// Add missing zero 
	function addZero(i) { if (i < 10) { i = "0" + i; } return i; }

	// Pass hour,minutes and secons through function and add zero
    let h    = addZero(today.getHours()),
        m    = addZero(today.getMinutes()),
        s    = addZero(today.getSeconds()),
        hour = h + ":" + m + ":" + s;

    let newProduct = {...this.state.product};

    // If *must be completed* inputs are not empty, proceed;
    if( newProduct.img.length                > 0 && newProduct.name.length  > 0 && newProduct.id.length    > 0 &&
        newProduct.category.length           > 0 && newProduct.price.length > 0 && newProduct.color.length > 0 &&
        newProduct.availableProductNo.length > 0 && newProduct.size.length  > 0) {
    	
    	if(newProduct.category === 'children' && newProduct.subcategory === undefined) {
    		return;
    	} else {
	    	// Add addred product date and convert string price to number
	    	newProduct.addedProductDate   = todayDate+' ora: '+hour;
	        newProduct.price 			  = parseFloat(newProduct.price);
	        newProduct.availableProductNo = parseFloat(newProduct.availableProductNo);
	        // If oldPrice was inserted, convert to number
	        if(newProduct.oldPrice.length > 0) {
	        	newProduct.oldPrice = parseFloat(newProduct.oldPrice);
	        } else {
	        	newProduct.oldPrice = null;
	        }
	        // Send new product with new added data, to add the pNo by fetching category data and count it
	    	this.getFullData(newProduct);
    	}
    }
}

async getFullData(newProduct) {
	let product = newProduct;

	if(newProduct.category === 'men') {
		let getMen = await getAllMenProducts
		.then((menData) => {
			// Fetch all men products and set pNo to the newProd
			let menProd     = menData;
				product.pNo = menProd.length + 1;
				this.sendProductToDb(product);
		})
		.catch((err) => { console.log('Error while trying to fetch menData:'+ err); })
	} else if(newProduct.category === 'women') {
		let getWomen = await getAllWomenProducts
		.then((womData) => {
			// Fetch all men products and set pNo to the newProd
			let womenProd   = womData;
				product.pNo = womenProd.length + 1;
				this.sendProductToDb(product);
		})
		.catch((err) => { console.log('Error while trying to fetch womenData:'+ err); })
	} else {
		let getChildren = await getAllChildrenProducts
		.then((childData) => {
			// Fetch all men products and set pNo to the newProd
			let childrenProd = childData;
				product.pNo  = childData.length + 1;
				this.sendProductToDb(product);
		})
		.catch((err) => { console.log('Error while trying to fetch childrenData:'+ err); })
	}
}

sendProductToDb(product) {
	// Create a new user with those prop on database
	client.query(
	  q.Create(
	    q.Collection(product.category),
	    { data: product },
	  )
	)
	.then((resp) => { 
		// Display confirm message
	 	this.setState({ addProductConfMsg: true, addProductErrMsg: false})

	 	setTimeout(() => { window.location.reload()},3000);
	 })
	.catch((err) => {
		// Display error message
		this.setState({ addProductConfMsg: false, addProductErrMsg: true })
	})
}



	render() {
		// If user is not signed in and userDbInfo != null, display loading 
		if(this.props.userIsSignedIn === null && this.props.userDbInfo === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		}  else if(this.props.userIsSignedIn && this.props.userDbInfo === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		}


  		// If access_granted === undefined || !== 'mod' , redirect to mainpage
		if(this.props.userDbInfo.data.access_granted === undefined || this.props.userDbInfo.data.access_granted !== 'mod') {
			return ( <Redirect to={'/'}/> )
		}

		return (
			<div>
				<div className='row'>
					<div className='dashboard_addproduct_container col-12'>
						<div className='row'>
							<span className='dash_add_prod_title'>Adauga articol nou</span>
						</div>
						<div className='row'>
							<div className='dash_addprod_btnandback'>
								<span className='dash_add_prod_button' onClick={()=>this.addNewProductBtn()}>Aadauga articol</span>
								<Link to={'/dashboard'} className='dash_addprod_backtodash_btn'>&times;</Link>
							</div>
						</div>
						<div className='row'>
							<div className='dash_prod_add_btn_msg'>
								{this.state.addProductConfMsg && (
								<span className='dash_addprod_msg'>Produsul a fost adaugat. Pagina se va reimprospata in 3 sec.</span>
								)}
								{this.state.addProductErrMsg && (
								<span className='dash_addprod_msg' style={{color:'#FF3E3E'}}>Produsul nu a fost adaugat. Verifica console log</span>
								)}
							</div>
						</div>

						<div className='row justify-content-center'>
							<div className='dash_addprod_wrap'>

								{/* Product gallery */}
								{this.state.product.moreImages.length > 0 && (
								<div className='dash_addprod_galleryimage'>
									{this.state.product.moreImages.map((img,ind) =>
									<span key={ind} className='dashadd_prod_image'>
										<span className='dashadd_prod_remove_img' title='Elimina' onClick={()=>this.removeProductGalleryImg(ind)}>&times;</span>
										<img src={img} title={img}/>
									</span>
									)}
								</div>
								)}

								{/* Add Product gallery */}
								<span className='dash_add_prod_subtitle'>Adauga imagini galerie* <span>(Prima imagine va fi folosita ca imagine de profil al articolului)</span></span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.newUrlProductGallery} onChange={(e) => this.addUrlProductGallery(e)}/>
		 						</span>
		 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.addUrlProductGalleryBtn()}>Adauga</span>

		 						{/* Add product name*/}
		 						<span className='dash_add_prod_subtitle'>Nume articol*</span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.product.name} onChange={(e) => this.addProductName(e)}/>
		 						</span>

		 						{/* Add Product id */}
		 						<span className='dash_add_prod_subtitle'>ID articol*</span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.product.id} onChange={(e) => this.addProductId(e)}/>
		 						</span>

		 						{/* Product numbers available */}
		 						<span className='dash_add_prod_subtitle'>Numar bucati articol*</span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.product.availableProductNo} onChange={(e) => this.addAvailProdNo(e)}/>
		 						</span>

		 						{/* Add product category*/}
		 						<span className='dash_add_prod_subtitle'>Categorie articol*</span>
		 						<span className='dash_addproduct_input_wrap'>
									 <select className="custom-select form-control" onChange={(e)=>this.addCategory(e)}>
									    <option></option>
									    <option>Barbati</option>
									    <option>Femei</option>
									    <option>Copii</option>
									</select>
								</span>

								{/* Add product subcategory*/}
								{this.state.product.category === 'children' && (
								<React.Fragment>
		 						<span className='dash_add_prod_subtitle'>Subcategorie articol*</span>
		 						<span className='dash_addproduct_input_wrap'>
									 <select className="custom-select form-control" onChange={(e)=>this.addSubCategory(e)}>
									    <option></option>
									    <option>Baieti</option>
									    <option>Fete</option>
									    <option>Unisex</option>
									</select>
								</span>
								</React.Fragment>
								)}


								{/* Add product category*/}
		 						<span className='dash_add_prod_subtitle'>Articol nou in stoc?</span>
		 						<span className='dash_addproduct_input_wrap'>
									 <select className="custom-select form-control" onChange={(e)=>this.addProductNew(e)}>
									    <option></option>
									    <option>Nu</option>
									    <option>Da</option>
									</select>
								</span>

								{/* Add product price */}
		 						<span className='dash_add_prod_subtitle'>Pret articol*</span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.product.price} onChange={(e) => this.addProductPrice(e)}/>
		 						</span>

		 						{/* Add product old price */}
		 						<span className='dash_add_prod_subtitle'>Pret vechi articol</span>
								<span className='dash_update_input_wrap'>
			 						<input type='text' value={this.state.product.oldPrice} onChange={(e) => this.addProductOldPrice(e)}/>
		 						</span>


		 						{/* Product color */}
		 						<span className='dash_add_prod_subtitle'>Culoare articol*</span>
		 						<span className='dash_update_prodcolor_display'>Culoare: <span>{this.state.product.color}</span> <span style={{backgroundColor: this.state.product.color}}></span></span>
		 						<div className='dash_update_product_color_wrap'>
		 							<ul>
		 								{this.state.productColorsList.map((color,ind) =>
		 									<li className='dash_produp_color_sel' title={color} alt={color} style={{backgroundColor: color}} key={ind} onClick={(e)=>this.setProductColor(color)}></li>
		 								)}
		 							</ul>
		 						</div>

		 						{/* Display available product colors */}
		 						<span className='dash_add_prod_subtitle'>Total culori valabile pentru acest articol</span>
		 						<div className='dash_update_product_color_wrap'>
		 							<ul>
		 								{this.state.product.colors.map((color,ind) =>
		 									<li className='dash_produp_color_sel' title={color} alt={color} style={{backgroundColor: color}} key={ind}></li>
		 								)}
		 							</ul>
		 						</div>

		 						{/* Same product, different colors with URL target */}
		 						<span className='dash_add_prod_subtitle'>Acelasi articol, diferite culori</span>
		 						<span className='dash_update_prodcolor_display'>url: "/productinfo/ + id articol"</span>
		 						<div className='dash_updatemorecolors_cont'>
		 							{this.state.product.moreColors.map((moreColor,ind) =>
		 							<div key={ind} className='dash_upmorecol_cont'>
		 								<span className='dash_update_morecolors_title'>Culoare<span title='Sterge culoare' title='Sterge culoare' className='dash_update_remov_morecolorsbtn' onClick={(e)=>this.removeMoreColors(ind)}>&times;</span></span>
		 								<span className='dash_update_input_wrap'>
				 							<input type='text' value={moreColor.color}/>
				 						</span>
				 						<span>URL</span>
		 								<span className='dash_update_input_wrap'>
				 							<input type='text' value={moreColor.url}/>
				 						</span>

		 							</div>
		 							)}

		 							<span className='dash_add_prod_subtitle'>Adauga culori <span>(Alege numele culorii, utilizand ca referinta lista de mai sus)</span></span>
		 							<span className='dash_update_input_wrap'>
				 							<input type='text' value={this.state.addNewColor} placeholder='Culoare ex: black,red,blue' onChange={(e) => this.addMoreColors(e,'color')}/>
			 						</span>
			 						<span className='dash_update_input_wrap'>
			 							<input type='text' value={this.state.addNewURLColor} placeholder="URL catre articol. Ex: '/productinfo/id articol'" onChange={(e) => this.addMoreColors(e,'url')}/>
			 						</span>
			 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.addMoreColorsBtn()}>Adauga</span>
		 						</div>


		 						{/* Add product print*/}
		 						<span className='dash_add_prod_subtitle'>Imprimeu articol</span>
		 						<span className='dash_addproduct_input_wrap'>
									 <select className="custom-select form-control" onChange={(e)=>this.addProductPrint(e)}>
									    <option>Fara</option>
									    <option>Grafic</option>
									    <option>Mesaj</option>
									</select>
								</span>


								{/* ______ Add product material _____ */}

								<span className='dash_update_subtitle'>Material articol</span>
								<div className='dash_update_productmaterial_cont'>
									<div className='dash_update_productmaterial_list'>
										{this.state.product.material.map((el,ind) =>
										<span key={ind} title='Elimina' alt='Elimina' className='dash_prod_mat_li' onClick={(e) =>this.removeProductMaterial(ind)}><span>&times;</span>{el}</span>
										)}
									</div>

									<div className='dash_update_prodmat_add_mat_div'>
										<span className='dash_prod_mat_li' title='Adauga' alt='Adauga' onClick={()=>this.addProductMaterial('cotton')}><span>+</span>Bumbac</span>
										<span className='dash_prod_mat_li' title='Adauga' alt='Adauga' onClick={()=>this.addProductMaterial('polyester')}><span>+</span>Poliester</span>
										<span className='dash_prod_mat_li' title='Adauga' alt='Adauga' onClick={()=>this.addProductMaterial('organic')}><span>+</span>Organic</span>
									</div>
								</div>


								{/* ______ Add product size _____ */}

								<span className='dash_update_subtitle'>Marimi articol</span>
								<div className='dash_update_productmaterial_cont'>
									<div className='dash_update_productmaterial_list'>
										{this.state.product.size.map((size,ind) =>
										<span key={ind} title='Elimina' alt='Elimina' className='dash_prod_mat_li' onClick={(e) =>this.removeProductSize(ind)}><span>&times;</span>{size}</span>
										)}
									</div>

									<div className='dash_update_prodmat_add_mat_div'>
										{this.state.productSizeList.map((size,ind) =>
										<span key={ind} title='Adauga' alt='Adauga' className='dash_prod_mat_li' onClick={()=>this.addProductSize(size)}><span>+</span>{size}</span>
										)}
									</div>
								</div>
								 
								{/* ______ Add product necktype _____ */}
								<span className='dash_update_subtitle'>Pe gat (stil tricou)</span>
								<div className='dash_update_productmaterial_cont'>
									<div className='dash_update_productmaterial_list'>
										{this.state.product.necktype.map((neckType,ind) =>
										<span key={ind} title='Elimina' alt='Elimina' className='dash_prod_mat_li' onClick={(e) =>this.removeProductNecktype(ind)}><span>&times;</span>{neckType}</span>
										)}
									</div>

									<div className='dash_update_prodmat_add_mat_div'>
										{this.state.productNecktypeList.map((neckType,ind) =>
										<span key={ind} title='Adauga' alt='Adauga' className='dash_prod_mat_li' onClick={()=>this.addProductNecktype(neckType.neckTypeEng)}><span>+</span>{neckType.neckTypeRo}</span>
										)}
									</div>
								</div>

								{/* ______ Update product RO description _____ */}

								<span className='dash_update_subtitle'>Detalii articol</span>
								<div className='dash_updateprod_prod_rodescr'>
									{this.state.product.ro.map((roDescr,ind) =>
		 							 
		 							<div className='dash_up_proddescr_box'>
			 							<span key={ind} className='mb-1'><strong>{roDescr.type}</strong></span>
			 							<span className='dash_update_removeprod_descr_btn' alt={'Elimina ' + roDescr.type} title={'Elimina ' + roDescr.type} onClick={(e)=>this.removeProductRoDescr(ind)}>&times;</span>
			 							<span className='dash_update_input_wrap'>
					 							<input type='text' value={roDescr.descr}/>
				 						</span>
			 						</div>
			 						)}
		 						</div>

		 						{/* Add new product description */}
		 						<span className='dash_update_subtitle'>Adauga detalii articol</span>
	 							<span className='dash_update_input_wrap'>
			 							<input type='text' value={this.state.newProdTypeDescr} placeholder='Ex: Descriere,Model,Imprimeu,Instructiuni'onChange={(e) => this.addNewProdTypeDescr(e,'type')}/>
		 						</span>
		 						<span className='dash_update_input_wrap'>
		 							<input type='text' value={this.state.newProdDescr} placeholder='Text corespunzator descrierii' onChange={(e) => this.addNewProdTypeDescr(e,'descr')}/>
		 						</span>
		 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.addNewProdTypeDescrBtn()}>Adauga</span>


							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const addProduct = connect(mapStateToProps,null)(connectedAddProduct);
export default addProduct;