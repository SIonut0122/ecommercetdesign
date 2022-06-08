import   React                  from 'react';
import { Link, Redirect      }  from 'react-router-dom';
import { connect             }  from "react-redux";
import { client, q           }  from '../../fauna/db';
import { setMenProductsDb, 
		 setWomenProductsDb,
		 setSearchInput      }  from '../../actions';
import   getAllWomenProducts    from '../products/getAllWomenProducts';
import   getAllMenProducts      from '../products/getAllMenProducts';
import   getAllChildrenProducts from '../products/getAllChildrenProducts'; 
import   addProduct             from './addProduct';
import '../../css/Dashboard.css';





const mapStateToProps = state => {
  return { 
  		 userIsSignedIn   : state.userIsSignedIn,
  		 userDbInfo       : state.userDbInfo
  		};
};



class connectedDashboard extends React.Component {
	  constructor(props) {
    	super(props)

    	this.state = {
    		productsMenu           	   : [{prodRo:'Bărbați',prodEng:'Men'},{prodRo:'Femei',prodEng:'Women'},{prodRo:'Copii',prodEng:'Children'},{prodRo:'Toate',prodEng: 'All'}],
    		resultedProducts       	   : null,
    		displayedProducts      	   : null,
    		searchById             	   : '',
    		selectedMenuProducts   	   : 'Bărbați',
    		currentPage            	   : 1,
			productsPerPage        	   : 12,
			productColorsList      	   : ['white','black','brown','silver','red','yellow','gold','orange','azure','blue','navy','gray','khaki','lightgreen','green','coral','purple','pink','fuchsia'],
			productSizeList        	   : ['XXS','XS','S','M','L','XL','XXL','3XL'],
			productNecktypeList    	   : [{neckTypeEng: 'roundneck', neckTypeRo: 'Guler rotund'},{neckTypeEng: 'vneck', neckTypeRo: 'decolteu in V'},{neckTypeEng: 'withcollar', neckTypeRo: 'Cu guler'},{neckTypeEng: 'hooded', neckTypeRo: 'Cu glugă'}],
			updateProduct              : false,
			product                    : null,
			copyOfProduct              : null,
			addNewGalleryUrl           : '',
			addNewColor                : '',
			addNewURLColor             : '',
			newProdTypeDescr           : '',
			newProdDescr               : '',
			displayProductUpdateMsg    : false,
			displayProductUpdateErrMsg : false,
    	
    	}
	}

componentDidMount() {
    this.fetchWomenProducts();
    // Scoll to top on every mount
	window.scrollTo(0, 0);
 }

 componentWillUnmount() {
 	// Display header and remove margin top from main container
   	document.querySelector('.header_container').removeAttribute('style');
    document.querySelector('.main_container').removeAttribute('style');
 }

async fetchWomenProducts() {
	// Collect all women products
		let get = await getAllWomenProducts
		.then((resp) => {
				// Collect inside womenProductsData only womenProds data
		     	let womenProductsFetchedData = [];
		     	resp.forEach(el => { womenProductsFetchedData.push(el); });
		     	// Set refId from (product data -> ref.value.id);
		     	womenProductsFetchedData.forEach(el => el.data.refId = el.ref.value.id );
		     	// Extract only data from object product
		     	let womenProdDataWithRefId = womenProductsFetchedData.map(el => el.data);
		     	// Set state to concat
		     	this.setState({ womenProductsFetchedData: womenProdDataWithRefId },() => {
		     	// Call second function to collect men products too
		     	this.fetchMenProducts();
		     	   setTimeout(() => {
			     	// Highlight first pagination number when page loads
					let pages = document.querySelectorAll('.dash_page_nolink');
					pages.forEach(el => { if(parseFloat(el.innerHTML) === 1) { el.classList.add('pag_active')} });
			     },1000);
		     	})
		     	 
		     })
		// If error returned, continue with second function
		 .catch((error) => { console.log('Error while fetching women products data: ', error.message); this.fetchMenProducts(); })
}

async fetchMenProducts() {
		// Collect all men products
		let get = await getAllMenProducts
		.then((resp) => {
				// Collect inside menProductsFetchedData only menProds data
		     	let menProductsFetchedData = [];
		     	resp.forEach(el => menProductsFetchedData.push(el));
		     	// Set refId from (product data -> ref.value.id);
		     	menProductsFetchedData.forEach(el => el.data.refId = el.ref.value.id );
		     	// Extract only data from object product
		     	let menProdDataWithRefId = menProductsFetchedData.map(el => el.data);
		     	// Set state to concat for results
		     	this.setState({ menProductsFetchedData: menProdDataWithRefId }, () => {
		     		this.fetchChildrenProducts();
		     	})      
		     })
		// If error returned, continue displaynewresults with already fetched data
		 .catch((error) => { console.log('Error while fetching men products data: ', error.message);})
}

async fetchChildrenProducts() {
		// Collect all men products
		let get = await getAllChildrenProducts
		.then((resp) => {
				// Collect inside childrenProductsFetchedData only menProds data
		     	let childrenProductsFetchedData = [];
		     	resp.forEach(el => childrenProductsFetchedData.push(el));
		     	// Set refId from (product data -> ref.value.id);
		     	childrenProductsFetchedData.forEach(el => el.data.refId = el.ref.value.id );
		     	// Extract only data from object product
		     	let childrenProdDataWithRefId = childrenProductsFetchedData.map(el => el.data);
		     	// Set state to concat for results
		     	this.setState({ childrenProductsFetchedData: childrenProdDataWithRefId }, () => {
			     	// Call function to concat all results and display only new products
			     	this.renderProd(); 
		     	})
		      
		     })
		// If error returned, continue displaynewresults with already fetched data
		 .catch((error) => { console.log('Error while fetching children products data: ', error.message);})
}

renderProd() {
	// Assign new product number from low to high 
	let orderpNo = [...this.state.menProductsFetchedData, ...this.state.womenProductsFetchedData, ...this.state.childrenProductsFetchedData];

	this.setState({ resultedProducts: orderpNo, displayedProducts: this.state.menProductsFetchedData})
 }

searchById(e) {
	let id = e.target.value.toLowerCase();
	// Return to first page when user start typing
	this.returnPage(1);
	// If input length > 0,set state
	if(id.length > 0) {
			// If value, search inside all products and displayerdProd state
		this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.id.toLowerCase().includes(id)) })
	} else if(!id.length > 0){

		// Search selectedMenuproducts by romanian word and display products
		switch(this.state.selectedMenuProducts) {
			case 'Bărbați': 
			this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'men')})
			break;
			case 'Femei': 
			this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'women') })
			break;
			case 'Copii': 
			this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'children') })
			break;
			case 'Toate': 
			this.setState({ displayedProducts: this.state.resultedProducts })
			break;
			default: 
			return;
		}

	}
}

selectProductsMenu(e) {
	// Set state to display selected romanian title
	this.setState({ selectedMenuProducts: e.prodRo })
	// Set state according to the selected nav products menu
	switch(e.prodEng) {
		case 'Men': 
		this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'men') })
		break;
		case 'Women': 
		this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'women') })
		break;
		case 'Children': 
		this.setState({ displayedProducts: this.state.resultedProducts.filter(el => el.category === 'children') })
		break;
		case 'All': 
		this.setState({ displayedProducts: this.state.resultedProducts })
		break;
		default: 
		return;
	}

	setTimeout(() => {
	 	this.setState({ currentPage: 1 })
	 	this.returnPage(1);
	},300);
}


/* Pagination */

returnPage(pageNo) {
	// Set page number and hightlight current page
	setTimeout(() => {
		this.setState({ currentPage: pageNo })
		let pages = document.querySelectorAll('.dash_page_nolink');
			pages.forEach(el => { 
				// If DOM page innerHTML number === currpage, highlight page.
				if(parseFloat(el.innerHTML) === pageNo) {
					el.classList.add('pag_active');			 	 
				} else {
					el.classList.remove('pag_active');
				}
			});
	},500);

}


updateThisProductBtn(prodToUpdate) {
	// Set product to display and keep a copy of this product to restore default
	this.setState({ product: prodToUpdate, copyOfProduct: prodToUpdate })
	// After 0.5sec, display updateproduct container
	setTimeout(() => {
		this.setState({ updateProduct: true })	
	},500);
	setTimeout(() => {	
		// Call function to check checkboxes to which this product belong
		// Those are checking product category/new/print value and then is searching through DOM for this checkbox value 
		this.restoreProductCategory();	
		this.restoreDefaultProductIsNew();
		this.restoreDefaultPrint();

		if(prodToUpdate.subcategory !== undefined && prodToUpdate.category === 'children') {
			// Check children subcategory checkbox
			this.restoreProductSubCategory();
		} 
	},1000);
}

closeUpdateThisProduct() {
	this.setState({ updateProduct              : false, // Close updateproduct container
					product                    : null,  // Clear product value
					copyOfProduct              : null,  // 
					displayProductUpdateMsg    : false, // Hide any message if displayed
					displayProductUpdateErrMsg : false  //
				})
}


/*  _____ UPDATE PRODUCT INFO ______ */

/* ______  Update product title ______   */

updateProductTitle(e) {
	let newProductTitle = e.target.value;
	// Set new url product image profile on change
	if(newProductTitle.length > 0) {
		this.setState(prevState => ({
			product:{
				...prevState.product,
				name: newProductTitle
			}
		}))
	}
}

restoreDefaultProductTitle() {
	// Restore default product title from copyOfProduct
	this.setState(prevState => ({
		product:{
			...prevState.product,
			name: this.state.copyOfProduct.name 
		}
	}))	
}


/* ______ Update product profile image ______   */

updateProfileProductImage(e) {
	let URL = e.target.value;
	// Set new url product image profile on change
	this.setState(prevState => ({
		product:{
			...prevState.product,
			img: URL
		}
	}))
}

restoreProfileProductImage() {
 	// Restore profile image from copyOfProduct
	this.setState(prevState => ({
		product:{
			...prevState.product,
			img: this.state.copyOfProduct.img 
		}
	}))
}

/* ______ Update product gallery images ______ */

updateMoreImagesUrl(e,ind) {
	// Get input value, use the index to target moreImages URL position and update it
	if(e.target.value.length > 0) {
	let URL        		= e.target.value,
		moreImages 		= [...this.state.product.moreImages];
 		moreImages[ind] = URL;
 	let product = Object.assign({}, this.state.product, {
 		moreImages: moreImages
 	})

 	this.setState({ product })
 }
}

restoreAllMoreImagesUrls() {
	// Restore default product gallery images from the copy state of the product
	this.setState(prevState => ({
		product: {
			...prevState.product,
			moreImages: this.state.copyOfProduct.moreImages
		}
	}))
}

removeMoreImagesUrl(index) {
	// Remove clicked gallery image
  	this.setState(prevState => ({
		product: {
			...prevState.product,
			moreImages: this.state.product.moreImages.filter(el => this.state.product.moreImages.indexOf(el) !== index)
		}
	}))
}

addMoreGalleryImage(e) {
	// Set new URL from gallery input
	let newGalleryImage = e.target.value;
	this.setState({ addNewGalleryUrl: newGalleryImage })
}

addMoreGalleryImgBtn() {
	let addNewGalleryUrl  = this.state.addNewGalleryUrl,
		moreImages        = [...this.state.product.moreImages]; // Get product gallery array

	// if new URL length > 0, push new url inside product more gallery
	if(addNewGalleryUrl.length > 0) {
		moreImages.push(addNewGalleryUrl);
		this.setState(prevState => ({
		product: {
			...prevState.product,
			moreImages: moreImages
		},
		addNewGalleryUrl: '' // Clear input gallery after submit
	}))
	}
}


/* ______ Update product ID ______ */

updateProductId(e,actionType) {
	let productId = actionType === 'set' ? e.target.value : this.state.copyOfProduct.id;

	// Set new id
	this.setState(prevState => ({
		product:{
			...prevState.product,
			id: productId,
		}
	}))
}


updateAvailProdNo(e,actionType) {
	let productAvailProdNo = actionType === 'set' ? e.target.value : this.state.copyOfProduct.availableProductNo;

	// Set new id
	this.setState(prevState => ({
		product:{
			...prevState.product,
			availableProductNo: productAvailProdNo,
		}
	}))
}

/* ______ Update product category ______ */

updateProductCategory(e,category) {
	let categoryCheckboxes = document.querySelectorAll('.upprod_categ_cls');
	// Uncheck all category checkboxes
	categoryCheckboxes.forEach(el => el.checked = false);
	// Check this checkbox
	e.target.checked = true;

	// Set new category
	this.setState(prevState => ({
		product:{
			...prevState.product,
			category: category,
			subcategory: category !== 'children' ? null : this.state.product.subcategory 
		}
	}))
}

restoreProductCategory() {
		// Select all category checkboxes
	let categoryProductCheckboxes = document.querySelectorAll('.upprod_categ_cls'),
	    defaultCategory           = this.state.copyOfProduct.category;
		// Uncheck all category checkboxes
		categoryProductCheckboxes.forEach(el => { 
			el.checked = false
			// Get input label innerHtml value
			let inputLabelValue = el.nextElementSibling.innerHTML;

			// Check romanian word inside input label which is displayed on dashboard
			// If input value match predefined romanian word
			if(inputLabelValue === 'Femei') {
				// Check english product word
				// If empty, check checkbox
				if(defaultCategory === 'women') {
					el.checked = true;
				}
			} else if (inputLabelValue === 'Barbati') {
				if(defaultCategory === 'men') {
					el.checked = true;
				}
			} else if(inputLabelValue === 'Copii') {
				// If defaultCategory is not equal with 'femei','barbati' then check children checkbox
				if(defaultCategory === 'children') {
					el.checked = true;
				}
			}
		})
		// Set default category
		this.setState(prevState => ({
			product:{
				...prevState.product,
				category: defaultCategory
			}
		}))
}


/* ______ Update product subcategory ______ */


updateProductSubCategory(e,subcategory) {
	let subCategoryCheckboxes = document.querySelectorAll('.upprod_subcateg_cls');
	// Uncheck all subcategory checkboxes
	subCategoryCheckboxes.forEach(el => el.checked = false);
	// Check this checkbox
	e.target.checked = true;
	// Set new subcategory
	this.setState(prevState => ({
		product:{
			...prevState.product,
			subcategory: subcategory
		}
	}))
}

restoreProductSubCategory() {
		// Select all category checkboxes
	let subcategoryProductCheckboxes = document.querySelectorAll('.upprod_subcateg_cls'),
	    defaultSubCategory           = this.state.copyOfProduct.subcategory;
		// Uncheck all subcategory checkboxes
		subcategoryProductCheckboxes.forEach(el => { 
			el.checked = false
			// Get input label innerHtml value
			let inputLabelValue = el.nextElementSibling.innerHTML;
			// Check romanian word inside input label which is displayed on dashboard
			// If input value match predefined romanian word
			if(inputLabelValue === 'Baieti') {
				// Check english product word
				// If empty, check checkbox
				if(defaultSubCategory === 'boys') {
					el.checked = true;
				}
			} else if (inputLabelValue === 'Fete') {
				if(defaultSubCategory === 'girls') {
					el.checked = true;
				}
			} else if(inputLabelValue === 'Unisex') {
				// If defaultCategory is not equal with 'femei','barbati' then check children checkbox
				if(defaultSubCategory === 'unisex') {
					el.checked = true;
				}
			}
		})
		// Set default subcategory
		this.setState(prevState => ({
			product:{
				...prevState.product,
				subcategory: defaultSubCategory
			}
		}))
}

/* ______ Update product is new ______ */

updateProductIsNew(e,bol) {
	// Select all new checkboxes
	let newProductCheckboxes = document.querySelectorAll('.upprod_newprod_cls');
	// Uncheck all new product checkboxes
	newProductCheckboxes.forEach(el => el.checked = false);
	// Check this checkbox
	e.target.checked = true;
	// Set new category
	this.setState(prevState => ({
		product:{
			...prevState.product,
			new: bol
		}
	}))
}

restoreDefaultProductIsNew() {
	let newProductCheckboxes = document.querySelectorAll('.upprod_newprod_cls'),
		defaultNew           = this.state.copyOfProduct.new;
		// Uncheck all category checkboxes
		newProductCheckboxes.forEach(el => { 
			el.checked = false
			// Get input label innerHtml value
			let inputLabelValue = el.nextElementSibling.innerHTML;

			// Check romanian word inside input label which is displayed on dashboard
			// If input value match predefined romanian word
			if(inputLabelValue === 'Da') {
				// Check english product word
				// If defaultNew is true
				if(defaultNew) {
					el.checked = true;
				}
				// If defaultNew is false, check label value for romanian word 'Nu', check if defaultNew is false, and check checkbox
			} else if(inputLabelValue === 'Nu') {
				if(!defaultNew) {
					el.checked = true;
				}
			} 
		})
		 
	this.setState(prevState => ({
		product:{
			...prevState.product,
			new: defaultNew
		}
	}))

}

/* ______ Update product price / old price ______ */

updateProductPrice(e,actionType) {
	let productPrice = actionType === 'set' ? e.target.value : this.state.copyOfProduct.price;

	// Set new price
	this.setState(prevState => ({
		product:{
			...prevState.product,
			price: productPrice
		}
	}))

}

updateProductOldPrice(e,actionType) {
	let productOldPrice = actionType === 'set' ? e.target.value : this.state.copyOfProduct.oldPrice;
	// Restore default oldprice
	this.setState(prevState => ({
		product: {
			...prevState.product,
			oldPrice: productOldPrice
		}
	}))
}

/* _____ Update product color _____ */

updateProductColor(e,color,actionType) {
	let productColor  = actionType === 'set' ? color : this.state.copyOfProduct.color;
	let prodColorList = document.querySelectorAll('.dash_produp_color_sel');

	// Hightlight color
	if(actionType === 'set') {
		prodColorList.forEach(el => el.style.border = 'none');
		e.target.style.border = '2px solid red';
	} else {
		// remove hightlight from all colors
		prodColorList.forEach(el => el.style.border = 'none');
	}
	// Set new color
	this.setState(prevState => ({
		product: {
			...prevState.product,
			color: productColor
		}
	}))
}


/* ______ Update add more colors URLs  ______ */

updateMoreColorsURL(e,ind,type) {
 	 // If received type input is 'color', proceed to change
 	 if(type === 'color') {
 	 	let newColor   = e.target.value,
 	 	    moreColors = [...this.state.product.moreColors];
 	 		moreColors[ind].color = newColor;

 	 	 this.setState(prevState => ({
				product: {
					...prevState.product,
					moreColors: moreColors
				}
			}))
 	 } else if(type === 'url') {
 	 	let newURL = e.target.value,
 	 	    moreColors = [...this.state.product.moreColors];
 	 		moreColors[ind].url = newURL;

 	 		 this.setState(prevState => ({
				product: {
					...prevState.product,
					moreColors: moreColors
				}
			}))	
 	 } 
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
			this.setState(prevState => ({
				product: {
					...prevState.product,
					moreColors: moreColors
				},
				addNewURLColor: '',
				addNewColor: ''
			}))
		}
	}
}


/* _____ Update product print  _____ */

updatePrintProduct(e,actionType) {
	let printProductCheckboxes = document.querySelectorAll('.upprod_print_cls');
	// Uncheck all category checkboxes
	printProductCheckboxes.forEach(el => el.checked = false);
	// Check this checkbox
	e.target.checked = true;
	let print = '';
	if(actionType === 'grafic') {
		print = 'graphic';
	} else if(actionType === 'mesaj') {
		print = 'message';
	} else {
		print = '';
	}
	this.setState(prevState => ({
		product:{
			...prevState.product,
			print: print
		}
	}))
} 

restoreDefaultPrint() {
	let printProductCheckboxes = document.querySelectorAll('.upprod_print_cls');
		let defaultPrint = this.state.copyOfProduct.print;
		// Uncheck all category checkboxes
		printProductCheckboxes.forEach(el => { 
			el.checked = false
			// Get input label innerHtml value
			let inputLabelValue = el.nextElementSibling.innerHTML;

			// Check romanian word inside input label which is displayed on dashboard
			// If input value match predefined romanian word
			if(inputLabelValue === 'Fara') {
				// Check english product word
				// If empty, check checkbox
				if(defaultPrint === '') {
					el.checked = true;
				}
			} else if (inputLabelValue === 'Mesaj') {
				if(defaultPrint === 'message') {
					el.checked = true;
				}
			} else {
				// If defaultPrint is not equal with 'fara','mesaj' then check graphic checkbox
				if(defaultPrint === 'graphic') {
					el.checked = true;
				}
			}
		})
		 

	this.setState(prevState => ({
		product:{
			...prevState.product,
			print: defaultPrint
		}
	}))

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

restoreDefaultMaterial() {
	// Restore default product materials
	this.setState(prevState => ({
		product: {
			...prevState.product,
			material: this.state.copyOfProduct.material
		}
	}))
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

restoreDefaultProductSize() {
	// Restore default product size
	this.setState(prevState => ({
		product: {
			...prevState.product,
			size: this.state.copyOfProduct.size
		}
	}))
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

restoreDefaultProductNecktype() {
	// Restore default product necktype
	this.setState(prevState => ({
		product: {
			...prevState.product,
			necktype: this.state.copyOfProduct.necktype
		}
	}))
}


/* _____ Update product ro description  _____ */

updateRoProductDescr(e,ind) {
	let ro = [...this.state.product.ro];
	// Find edited input index inside prod ro
	for(let c in ro) {
		// If index match, edit prod ro descr
		if(ro.indexOf(ro[c]) === ind) {
			ro[c].descr = e.target.value;
		}
	}

	// Set state while changing
	this.setState(prevState => ({
		product: {
			...prevState.product,
			ro: ro
		}
	}))
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



applyChangesToProduct() {
	let product = {...this.state.product};

	// Get date and time when the order has been completed
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

    // Get time and set it to product before update
    product.lastUpdate         = todayDate+' ora: '+hour;
    // Convert available product number to number
    product.availableProductNo = parseFloat(product.availableProductNo);
    // Convert price and oldPrice string to number
    product.price              = parseFloat(product.price);
    // If oldPrice was inserted, convert  it to number
    if(product.oldPrice !== null) {
    	product.oldPrice = parseFloat(product.oldPrice);
    }
    // Replace product to database using and targeting the collecting to database with the category: men (men,women,children)
    // Use category "men' to target collection, and  id to target product to replace
	client.query(
	  q.Replace(
	    q.Ref(q.Collection(product.category), product.refId),
	    { data: product },
	  )
	)
	.then((ret) => { 
		// Display confirm message and reload page after 1.5sec to get updated data from database
		this.setState({ displayProductUpdateMsg: true, displayProductUpdateErrMsg: false})
		setTimeout(() => {
			window.location.reload();
		},1500);
		})
	.catch((err) => {
		// If product was not updated, display error message
		this.setState({ displayProductUpdateMsg: false, displayProductUpdateErrMsg: true})
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

	   // Hide header
	   	document.querySelector('.header_container').setAttribute('style','display:none !important;');
	    document.querySelector('.main_container').setAttribute('style','margin-top:0 !important;');

		// Check if products were loaded
  		if(this.state.resultedProducts === null) {
  			return (<span>Incarcare...</span>)
  		}

  		{/* Conts for pagination */}
		const indexOfLastProduct  = this.state.currentPage * this.state.productsPerPage,
			  indexOfFirstProduct = indexOfLastProduct - this.state.productsPerPage,
			  // Order data from low to high using sort
			  orderedProducts     = this.state.displayedProducts.sort((x, y) => x.pNo - y.pNo),
			  // Slice products for pagination
		      products            = orderedProducts.slice(indexOfFirstProduct, indexOfLastProduct),
			  // Divide prooducts length by the products per page state, and push resulted pageNumbers to array
		      pageNumbers = [];
		      // Calculate page numbers by dividing displayedProducts with productPerPage
			  for(let i=1; i <= Math.ceil(this.state.displayedProducts.length / this.state.productsPerPage); i++) {
				pageNumbers.push(i);
			  }

		// If component render, set document title
  		document.title = 'Panou de control';


		return (

			<div>	
				<div className='row justify-content-center'> 
					<div className='dashboard_container col-12'>

						<div className='row'>
							<span className='dashboard_title'>
								<Link to={'/'} className='dash_actorder_backbtn'><i className="fas fa-long-arrow-alt-left"></i> Inapoi la site</Link>
								<span>Panou de control</span>
							</span>
						</div>

						{/* Products nav menu */}
						<div className='row justify-content-center'>
							<div className='dash_products_nav_menu col-12'>
								{this.state.productsMenu.map((prodlink,ind) =>
								<span key={ind} className='dash_prod_menu_link' onClick={(e) => this.selectProductsMenu(prodlink)}>{prodlink.prodRo}</span>
								)}
								<Link to={'/dashboard/addproduct'} className='dash_prod_menu_link dash_addprod_menu_btn'>Adaugă produs</Link>
								<Link to={'/dashboard/activeorders'} className='dash_prod_menu_link dash_addprod_activeproducts'>Comenzi active</Link>
							</div>
						</div>

						{/* SEARCH BY ID INPUT */}
						<div className='row justify-content-center'>
							<div className='dash_search_byid_wrap'>
								<span className='dash_txt'>Cauta dupa id-ul produsului</span>

								<span className='dash_searchbyid_input_wrap'>
									<input type='text' 
										   placeholder='ID PRODUS'
										   onChange={(e) => this.searchById(e)}/>
								</span>
							</div>
						</div>

						{/* Selected menu title product */}
						<div className='row justify-content-center'>
							<span className='dash_selected_menu_title'>
								{this.state.selectedMenuProducts}
								{/* Display selected products number */}
								<span className='ml-1 mr-1' style={{color:'#188604'}}>({this.state.displayedProducts.length} {this.state.displayedProducts.length === 1 ? 'articol' : 'articole'})</span> 
								{/* If page > 1, display message */}
								{products.length > 0 && (
								<span>- Pagina: <strong>{this.state.currentPage}</strong> din <strong>{pageNumbers.length}</strong></span> 
								)}
							</span>
						</div>

						{/* DISPLAY PRODUCTS */}
						<div className='row justify-content-center'>
							<div className='d_prodcont_displayproducts col-12'>
								 <div className='display_prodcont_dash_products col-12'>
								 {products.length > 0 ? (
								 <React.Fragment>
								 {products.map((prod,ind) =>
								 	<span className='dash_prod_info' key={ind}>
								 		<img src={prod.img} alt={prod.title}/>
								 		<span className='dash_prodinfo_title'>{prod.pNo}) {prod.name}</span>
								 		<span className='dash_prodinfo_id'>ID: {prod.id}</span>
								 		<span className='dash_prodinfo_update_button' onClick={()=>this.updateThisProductBtn(prod)}>Actualizeaza</span>
								 	</span>
							 	)}
								</React.Fragment>
								):(
									<span>Nothing to disply</span>
								)}
								 </div>
							</div>
						</div>

						{/* Pagination */}
				 		<div className='row justify-content-center'>
				 			<div className='rp_wrap_pagination'>

				 				 <div className='row'>
								<nav>
									<ul className='pagination'>

										{pageNumbers.map(pageNo => (
											<li key={pageNo} className='page-item'>
											<span onClick={() => this.returnPage(pageNo)} className='page-link dash_page_nolink'>
											{pageNo}
											</span>
											</li>
										))}
									</ul>
								</nav>
								</div>
							</div>
				 		</div>




				 		{/* ________ UPDATE PRODUCT CONTAINER _______ */}


				 		{this.state.updateProduct && this.state.product !== null && (
					 		<div className='row justify-content-center'>
					 			<div className='dashboard_update_product col-12'>
					 				<span className='dash_update_prod_close' title='Inchide si anuleaza modificarile' onClick={()=>this.closeUpdateThisProduct()}>&times;</span>
					 				<div className='row justify-content-center'>
					 					<div className='dash_updateprod_firstsec dash_update_section col-12 col-md-6'>

					 						{/* Update product data */}

					 						<span className='dash_update_topinfo'>Data adaugarii: {this.state.product.addedProductDate !== undefined ? this.state.product.addedProductDate : '-'}</span>
					 						
					 						<span className='dash_update_topinfo mb-4'>Ultima actualizare: {this.state.product.lastUpdate !== undefined ? this.state.product.lastUpdate : 'niciodata'}</span>

											{/* Update product button */}
											<span className='dashboard_update_product_button' onClick={()=>this.applyChangesToProduct()}>Actualizeaza</span>
											
											{/* Update product message */}
											{this.state.displayProductUpdateMsg && (
											<span className='dashboard_up_prod_btn_msg'>Produsul a fost actualizat.</span>
											)}
											{this.state.displayProductUpdateErrMsg && (
											<span className='dashboard_up_prod_btn_msg mb-2' style={{color:'red'}}>Actualizare esuata. Reincercati.</span>
					 						)}

					 						{/* Product title */}
					 						<span className='dash_upprod_title'>{this.state.product.pNo}. {this.state.product.name}</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.name} onChange={(e)=>this.updateProductTitle(e)}/>
					 						</span>
					 						{/* Restore default profile img */}
					 						<span className='dash_update_prof_cancel_btn' onClick={()=>this.restoreDefaultProductTitle()}>Anuleaza</span>



					 						{/* Profile product img */}
					 						<img src={this.state.product.img} className='dash_update_profile_img'/>
					 						<span className='dash_update_subtitle'>Imagine profil</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.img} onChange={(e)=>this.updateProfileProductImage(e)}/>
					 						</span>
					 						{/* Restore default profile img */}
					 						<span className='dash_update_prof_cancel_btn' onClick={()=>this.restoreProfileProductImage()}>Anuleaza</span>


					 						{/* More images URLS */}
					 						<span className='dash_update_subtitle'>Galerie articol</span>
					 						<div className='dash_update_moreimages_cont'>

					 						{this.state.product.moreImages.map((imgUrl,ind) =>
					 							<div key={ind} className='dash_upmoreimg_img_url'>
					 								<span className='dash_up_gallery_removeprod_btn' onClick={(e)=>this.removeMoreImagesUrl(ind)}>&times;</span>
					 								<img src={imgUrl}/>
					 								<span className='dash_update_input_wrap dash_upinputwrap_moreimg'>
							 							<input type='text' value={imgUrl} onChange={(e) => this.updateMoreImagesUrl(e,ind)}/>
							 						</span>
					 							</div>
					 						)}
							 				<span className='dash_update_prof_cancel_btn' onClick={()=>this.restoreAllMoreImagesUrls()}>Anuleaza</span>

							 				{/* Add more colors */}
					 							<span className='dash_update_subtitle mt-3'>Adauga imagine galerie</span>
					 							
						 						<span className='dash_update_input_wrap'>
						 							<input type='text' value={this.state.addNewGalleryUrl} placeholder='Url catre imagine' onChange={(e) => this.addMoreGalleryImage(e)}/>
						 						</span>
						 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.addMoreGalleryImgBtn()}>Adauga</span>

					 						</div>
					 					</div>
					 					<div className='dash_updateprod_secsec dash_update_section col-12 col-md-6'>

					 						{/* Product id */}
					 						<span className='dash_update_subtitle'>ID articol</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.id} onChange={(e)=>this.updateProductId(e,'set')}/>
					 						</span>
					 						{/* Restore default profile img */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.updateProductId(e,'reset')}>Anuleaza</span>

					 						{/* Numar bucati articol */}
					 						<span className='dash_update_subtitle'>Numar bucati articol</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.availableProductNo} onChange={(e)=>this.updateAvailProdNo(e,'set')}/>
					 						</span>
					 						{/* Restore default profile img */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.updateAvailProdNo(e,'reset')}>Anuleaza</span>

					 						{/* Product Category */}
					 						<span className='dash_update_subtitle'>Categorie articol</span>
					 						<div className='dash_update_product_category'>
					 							<label className='custom-control custom-checkbox'>
												  <input className='custom-control-input upprod_categ_cls' type='checkbox' onChange={(e) => this.updateProductCategory(e,'women')}/>
												  <div className='custom-control-label'>
												  	Femei
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_categ_cls' type='checkbox' onChange={(e) => this.updateProductCategory(e,'men')}/>
												  <div className='custom-control-label'>
												  	Barbati
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_categ_cls' type='checkbox' onChange={(e) => this.updateProductCategory(e,'children')}/>
												  <div className='custom-control-label'>
												  	Copii
												  </div>
												</label>
											</div>
											{/* Restore default category */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreProductCategory()}>Anuleaza</span>

					 						{/* Product Category */}
					 						{this.state.product.category === 'children' && (
					 						<React.Fragment>
					 						<span className='dash_update_subtitle'>Subcategorie articol</span>
					 						<div className='dash_update_product_category'>
					 							<label className='custom-control custom-checkbox'>
												  <input className='custom-control-input upprod_subcateg_cls' type='checkbox' onChange={(e) => this.updateProductSubCategory(e,'boys')}/>
												  <div className='custom-control-label'>
												  	Baieti
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_subcateg_cls' type='checkbox' onChange={(e) => this.updateProductSubCategory(e,'girls')}/>
												  <div className='custom-control-label'>
												  	Fete
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_subcateg_cls' type='checkbox' onChange={(e) => this.updateProductSubCategory(e,'unisex')}/>
												  <div className='custom-control-label'>
												  	Unisex
												  </div>
												</label>
											</div>
											{/* Restore default category */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreProductSubCategory()}>Anuleaza</span>
					 						</React.Fragment>
					 						)}

											{/* New product select */}
				 							<span className='dash_update_subtitle'>Articol nou in stoc?</span>
				 							<div className='dash_update_newproduct_div'>
				 								<label className='custom-control custom-checkbox'>
												  <input className='custom-control-input upprod_newprod_cls' type='checkbox' onChange={(e) => this.updateProductIsNew(e,true)}/>
												  <div className='custom-control-label'>
												  	Da
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_newprod_cls' type='checkbox' onChange={(e) => this.updateProductIsNew(e,false)}/>
												  <div className='custom-control-label'>
												  	Nu
												  </div>
												</label>
											</div>
											{/* Restore default product is new */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreDefaultProductIsNew()}>Anuleaza</span>

											{/* ____ Product price ____ */}
					 						<span className='dash_update_subtitle'>Pret articol</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.price} onChange={(e)=>this.updateProductPrice(e,'set')}/>
					 						</span>
					 						{/* Restore default product price */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.updateProductPrice(e,'reset')}>Anuleaza</span>
					 						

					 						{/* Product old price */}
					 						<span className='dash_update_subtitle'>Pret articol vechi</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.product.oldPrice} onChange={(e)=>this.updateProductOldPrice(e,'set')}/>
					 						</span>
					 						{/* Restore default product old price */}
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.updateProductOldPrice(e,'reset')}>Anuleaza</span>
					 						
					 						{/* Product color */}
					 						<span className='dash_update_subtitle'>Culoare articol</span>
					 						<span className='dash_update_prodcolor_display'>Culoare: <span>{this.state.product.color}</span> <span style={{backgroundColor: this.state.product.color}}></span></span>
					 						<div className='dash_update_product_color_wrap'>
					 							<ul>
					 								{this.state.productColorsList.map((color,ind) =>
					 									<li className='dash_produp_color_sel' title={color} alt={color} style={{backgroundColor: color}} key={ind} onClick={(e)=>this.updateProductColor(e,color,'set')}></li>
					 								)}
					 							</ul>
					 						</div>
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.updateProductColor(e,'white','reset')}>Anuleaza</span>
					 						


					 						{/* _____ Same product, different color _____  */}

					 						<span className='dash_update_subtitle'>Acelasi articol, diferite culori</span>
					 						<span className='dash_update_prodcolor_display'>url: "/productinfo/ + id articol"</span>
					 						<div className='dash_updatemorecolors_cont'>
					 							{this.state.product.moreColors.map((moreColor,ind) =>
					 							<div key={ind} className='dash_upmorecol_cont'>
					 								<span className='dash_update_morecolors_title'>Culoare<span title='Sterge culoare' title='Sterge culoare' className='dash_update_remov_morecolorsbtn' onClick={(e)=>this.removeMoreColors(ind)}>&times;</span></span>
					 								<span className='dash_update_input_wrap'>
							 							<input type='text' value={moreColor.color} onChange={(e) => this.updateMoreColorsURL(e,ind,'color')}/>
							 						</span>
							 						<span>URL</span>
					 								<span className='dash_update_input_wrap'>
							 							<input type='text' value={moreColor.url} onChange={(e) => this.updateMoreColorsURL(e,ind,'url')}/>
							 						</span>

					 							</div>
					 							)}

				 							<span className='dash_update_subtitle'>Adauga culori</span>
				 							<span className='dash_update_input_wrap'>
						 							<input type='text' value={this.state.addNewColor} placeholder='Culoare ex: black,red,blue' onChange={(e) => this.addMoreColors(e,'color')}/>
					 						</span>
					 						<span className='dash_update_input_wrap'>
					 							<input type='text' value={this.state.addNewURLColor} placeholder="URL catre articol. Ex: '/productinfo/id articol'" onChange={(e) => this.addMoreColors(e,'url')}/>
					 						</span>
					 						<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.addMoreColorsBtn()}>Adauga</span>


					 						{/* ______ Available product colors _____ */}

					 						<span className='dash_update_subtitle'>Culori articol valabile</span>
					 						<div className='dash_update_product_color_wrap'>
					 							<ul>
					 								{this.state.product.colors.map((color,ind) =>
					 									<li className='dash_produp_color_sel' title={color} alt={color} style={{backgroundColor: color,cursor: 'default'}} key={ind}></li>
					 								)}
					 							</ul>
					 						</div>


					 						<span className='dash_update_subtitle'>Imprimeu articol</span>
					 						<div className='dash_prod_print_cont'>
						 						<label className='custom-control custom-checkbox'>
												  <input className='custom-control-input upprod_print_cls' type='checkbox' onChange={(e) => this.updatePrintProduct(e,'none')}/>
												  <div className='custom-control-label dash_print_none'>
												  	Fara
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_print_cls' type='checkbox' onChange={(e) => this.updatePrintProduct(e,'grafic')}/>
												  <div className='custom-control-label dash_print_graphic'>
												  	Grafic
												  </div>
												</label>

												<label className='custom-control custom-checkbox ml-3'>
												  <input className='custom-control-input upprod_print_cls' type='checkbox' onChange={(e) => this.updatePrintProduct(e,'mesaj')}/>
												  <div className='custom-control-label dash_print_message'>
												  	Mesaj
												  </div>
												</label>
											</div>
											<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreDefaultPrint()}>Anuleaza</span>

											{/* ______ Update product material _____ */}

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
											<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreDefaultMaterial()}>Anuleaza</span>



											{/* ______ Update product size _____ */}

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
											<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreDefaultProductSize()}>Anuleaza</span>


										{/* ______ Update product collar _____ */}

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
											<span className='dash_update_prof_cancel_btn' onClick={(e)=>this.restoreDefaultProductNecktype()}>Anuleaza</span>


											{/* ______ Update product RO description _____ */}


											<span className='dash_update_subtitle'>Detalii articol</span>
											<div className='dash_updateprod_prod_rodescr'>
												{this.state.product.ro.map((roDescr,ind) =>
					 							 
					 							<div className='dash_up_proddescr_box'>
						 							<span key={ind} className='mb-1'><strong>{roDescr.type}</strong></span>
						 							<span className='dash_update_removeprod_descr_btn' alt={'Elimina ' + roDescr.type} title={'Elimina ' + roDescr.type} onClick={(e)=>this.removeProductRoDescr(ind)}>&times;</span>
						 							<span className='dash_update_input_wrap'>
								 							<input type='text' value={roDescr.descr} onChange={(e) => this.updateRoProductDescr(e,ind)}/>
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
				 		)}
					</div>
				</div>
			</div>
			
		)
	}
}

 

const Dashboard = connect(mapStateToProps,null)(connectedDashboard);
export default Dashboard;