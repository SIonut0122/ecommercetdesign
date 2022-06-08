import   React                   from 'react';
import   cashOnDeliveryIcon      from '../images/cash-on-delivery.png';
import   expressDelivery         from '../images/express_delivery.png';
import   getAllWomenProducts     from './products/getAllWomenProducts';
import   getAllMenProducts       from './products/getAllMenProducts';
import   getAllChildrenProducts  from './products/getAllChildrenProducts';
import { Link, Redirect        } from 'react-router-dom';
import { connect               } from 'react-redux';
import { v4 as uuidv4          } from 'uuid';
import { client, q             } from '../fauna/db';
import { setCart,setUserDbInfo } from '../actions';
import '../css/Checkout.css';





const mapStateToProps = state => {
  return {  
          cart            : state.cart,
          totalCartAmount : state.totalCartAmount,
          cartIsLoaded    : state.cartIsLoaded, // Use this to avoid accessing checkout with manually URL. If true, from cart - proceed.
          userDbInfo      : state.userDbInfo,
          userIsSignedIn  : state.userIsSignedIn
        };
};


function mapDispatchToProps(dispatch) {
  return {
          setCart       : cart   => dispatch(setCart(cart)),
          setUserDbInfo : userDB => dispatch(setUserDbInfo(userDB))
        };
}

class connectedCheckout extends React.Component {


	state = {

		deliveryMethodLoading       : false,
		deliveryChecked             : false,
		city                        : ['Judet *','Alba','Arad','Argeș','Bacău','Bihor','Bistrița-Năsăud','Botoșani','Brașov','Brăila','Buzău','Caraș-Severin','Călărași','Cluj', 'Constanța','Covasna','Dâmbovița','Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov','Maramureș', 'Mehedinți','Mureș','Neamț','Olt','Prahova','Satu Mare','Sălaj','Sibiu','Suceava','Teleorman','Timiș','Tulcea','Vaslui','Vâlcea', 'Vrancea'],
		courierType                 : '',
		courierPrice                : '',
		cart                        : null,
		chkAddressLoading           : false,
		// Inputs fields values
		addressName                 : '',
		addressNameValid            : false,
		invalidNameMsg              : false,
		addressLastName             : '',
		addressLastNameValid        : false,
		invalidLastNameMsg          : false,
		addressPhone                : '',
		addressPhoneValid           : false,
		invalidPhoneMsg    			: false,
		addressStreet      			: '',
		addressStreetValid 			: false,
		invalidStreetMsg   			: false,
		addressCity        			: '',
		addressCityValid   			: false,
		invalidCityMsg              : false,
		addressSubCity              : '',
		addressSubCityValid         : false,
		invalidSubCityMsg           : false,
		addressAdditionalInfo       : '',
		addressInputsValid          : false,

		chkPaymentLoading           : false,
		paymentChecked              : false,
		paymentMsgError             : false,
		payementAgreeTerms          : false,
		addressAndPaymentFinished   : false,
		completedOrderDate          : null,
		completedOrderHour          : null,

		totalCartAmount             : this.props.totalCartAmount,
		totalCartAmountWithDelivery : this.props.totalCartAmount, 
	
	}

 

 
componentDidMount() {
 
	// Check if delivery is not selected already and display loading effect
	if(!this.state.deliveryChecked) {
		this.setState({ deliveryMethodLoading: true})
		//  Hide select delivery method payment after 1 sec
		setTimeout(() => this.setState({ deliveryMethodLoading: false }),1000);
	}
	this.scrollToTop();
	this.setState({ cart: this.props.cart })
}


handleDeliverySelect(e,courierType,courierPrice) {
	this.setState({ deliveryChecked: e.target.checked, courierType: courierType, courierPrice: courierPrice })

	this.scrollToTop();
	// Call function after selecting delivery method to recalculate total price
	this.checkDeliveryMethodPrice(courierPrice);
	// Complete address inputs with info from 'delivery info' from account panel
	this.fillAddressDelivery();
}

scrollToTop() {
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}


/* __ Input actions __ */

handleAddressName(e) {
	let addressName      = e.target.value,
	   		// Check addressName length to be higher than 0
	    checkValueLength = addressName.length > 0,
	   		// Check for blank spaces
	    checkWhiteSpaces = addressName.trim().length === addressName.length;

    	// if addressName value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({addressName: addressName, addressNameValid: true, invalidNameMsg: false})
    } else if(addressName.length === 0) {
      	// If input is empty, reset value input
        this.setState({addressName: '', addressNameValid: false})
    } else {
        this.setState({addressName: addressName, addressNameValid: false})
    }
}

handleAddressLastName(e) {
	let addressLastName  = e.target.value,
	   		// Check addressLastName length to be higher than 2
	    checkValueLength = addressLastName.length > 2,
	   		// Check for blank spaces
	    checkWhiteSpaces = addressLastName.trim().length === addressLastName.length;

    	// if addressLastName value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({addressLastName: addressLastName, addressLastNameValid: true, invalidLastNameMsg: false})
    } else if(addressLastName.length === 0) {
      	// If input is empty, reset value input
        this.setState({addressLastName: '', addressLastNameValid: false})
    } else {
        this.setState({addressLastName: addressLastName, addressLastNameValid: false})
    }	
}

handleAddressPhone(e) {
	let phoneValue       = e.target.value,
        // Check phone characters
        checkPhone       =  phoneValue.split('').every(x => x.match(/[0-9 ]+/g)),
        // Check phoneValue length to be at least 10
        checkPhoneLength = phoneValue.length === 10,
       // Check for blank spaces
        checkWhiteSpaces = phoneValue.trim().length === phoneValue.length;


    if(checkPhone && checkPhoneLength && checkWhiteSpaces) {
        this.setState({addressPhone: phoneValue, addressPhoneValid: true, invalidPhoneMsg: false})
      } else if(phoneValue.length === 0) {
        this.setState({addressPhone: '', addressPhoneValid: false})
      } else {
        this.setState({addressPhone: phoneValue, addressPhoneValid: false})
    }

}

handleAddressStreet(e) {
	let addressStreet    = e.target.value,
	   		// Check addressStreet length to be higher than 5
	    checkValueLength = addressStreet.length > 5,
	   		// Check for blank spaces
	    checkWhiteSpaces = addressStreet.trim().length === addressStreet.length;

    	// if addressStreet value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({addressStreet: addressStreet, addressStreetValid: true, invalidStreetMsg: false})
    } else if(addressStreet.length === 0) {
      	// If input is empty, reset value input
        this.setState({addressStreet: '', addressStreetValid: false})
    } else {
        this.setState({addressStreet: addressStreet, addressStreetValid: false})
    }		
}

handleAddressCity(e) {
	if(e.target.value !== 'Judet *') {
		this.setState({addressCity: e.target.value, addressCityValid: true, invalidCityMsg: false})
		e.target.style.color = '#202020';
	} else {
		this.setState({addressCity: '', addressCityValid: false})
		e.target.style.color = '#7D7D7D';
	}
}

handleAddressSubCity(e) {
	let addressSubCity       = e.target.value,
	   		// Check addressSubCity length to be higher than 2
	    checkValueLength  = addressSubCity.length > 2,
	   		// Check for blank spaces
	    checkWhiteSpaces = addressSubCity.trim().length === addressSubCity.length;

    	// if addressSubCity value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({addressSubCity: addressSubCity, addressSubCityValid: true, invalidSubCityMsg: false})
    } else if(addressSubCity.length === 0) {
      	// If input is empty, reset value input
        this.setState({addressSubCity: '', addressSubCityValid: false})
    } else {
        this.setState({addressSubCity: addressSubCity, addressSubCityValid: false})
    }
}


onAddressFocus(e) {
	// Animate label input (Email,Password) and change input border on focus
	e.target.parentElement.firstElementChild.setAttribute('style','transform:translateY(-175%);font-size:12.5px;color:#7D7D7D;');
	e.target.setAttribute('style','border:1px solid #000');
}

onAddressBlur() {
	// Handle click outside login inputs and animate to bottom label (Email,Password) if empty
	let addressInputs = document.querySelectorAll('.chk_addr_input');
	addressInputs.forEach((el) => {
		// If input is empty, animate label back and set default input border color
		if(el.value.length === 0) {
			el.previousElementSibling.removeAttribute('style');
			el.removeAttribute('style');
		}  
	});
}

handleAddrProceedBtn = () => {  	
	// Check all address delivery inputs			
 	// Reset all address error messages
 	this.setState({ invalidLastNameMsg: false,invalidNameMsg: false, invalidPhoneMsg: false, invalidStreetMsg: false, invalidCityMsg: false, invalidSubCityMsg: false})
 	// Check for invalid inputs and display error message
 	switch(false){
 		case this.state.addressLastNameValid:
 		this.setState({ invalidLastNameMsg: true })
 		break;
 		case this.state.addressNameValid:
 		this.setState({ invalidNameMsg: true })
 		break;
 		case this.state.addressPhoneValid:
 		this.setState({ invalidPhoneMsg: true })
 		break;
 		case this.state.addressStreetValid:
 		this.setState({ invalidStreetMsg: true })
 		break;
 		case this.state.addressCityValid:
 		this.setState({ invalidCityMsg: true })
 		break;
 		case this.state.addressSubCityValid:
 		this.setState({ invalidSubCityMsg: true })
 		break;
 		default:
 		// If all inputs are valid, proceed; Display loading effect
 		this.setState({ addressInputsValid: true, chkPaymentLoading: true })
 		// Scroll to top
 		this.scrollToTop();
 		// Hide loading modal after 1 sec
 		setTimeout(() => { this.setState({ chkPaymentLoading: false }) },1000)
 	}
}

addressBackBtn() {
	// Display select delivery method loading effect
	this.setState({ deliveryMethodLoading: true})
	//  Hide select delivery method payment after 1 sec
	setTimeout(() => this.setState({ deliveryMethodLoading: false }),1000);
	// Scroll to top
	this.scrollToTop();
	// Go back to delivery checkbox page and clear all address inputs
	// Reset all from 'select delivery method'
	this.setState({ 
		deliveryChecked : false, courierPrice         : '',    courierType        : '',
		addressName     : '',    addressNameValid     : false, invalidNameMsg     : false,
	    addressLastName : '',    addressLastNameValid : false, invalidLastNameMsg : false,
	    addressPhone    : '',    addressPhoneValid    : false, invalidPhoneMsg    : false,
	    addressStreet   : '',    addressStreetValid   : false, invalidStreetMsg   : false,
	    addressCity     : '',    addressCityValid     : false, invalidCityMsg     : false,
	    addressSubCity  : '',    addressSubCityValid  : false, invalidSubCityMsg  : false,
	    addressAdditionalInfo       :'',
	    totalCartAmountWithDelivery : this.props.totalCartAmount

	})
}


backBtnFromPayment() {
	// When clickin on back button from payment page, hide payment box and display address inputs
		// Invalidate address city select to be chosen again
 	this.setState({addressInputsValid: false, paymentChecked: false, chkAddressLoading: true, addressCityValid: false})
 	// Animate to top all labels (input names (name,lastname,phone) from inputs address because there is value inside
 	  // with delay (leave time to render).

 	setTimeout(() => {
 		// If addressInputs is displayed
 		if(!this.state.addressInputsValid) {
 			// Map through all labels and move label title to the top of inputs
			let addressInputs = document.querySelectorAll('.chk_inp_label');
			    addressInputs.forEach((el) => { el.setAttribute('style','transform:translateY(-175%);font-size:12.5px;color:#7D7D7D;'); });
			// Check if there was added some additional value and animate the additional value label
			if(document.querySelector('.chk_add_inp_addinfo').value.length > 0) {
				document.querySelector('.chk_inp_label_addinfo').setAttribute('style','transform:translateY(-175%);font-size:12.5px;color:#7D7D7D;');
			}
		}
	},500);
	setTimeout(() => { this.setState({ chkAddressLoading: false }) },1000);
}

handleFinishOrderBtn() {
	let userDbInfo = this.props.userDbInfo.data.myorders !== undefined ? this.props.userDbInfo.data.myorders : [];

	// If payment was selected and 'Agree with conditions' was checked, continue, if not, display error message
	if(this.state.paymentChecked) {
		// Get date and time when the order has been completed
		let today     = new Date(),
        	todayDate = today.getDate()  + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
      		time      = today.getHours() + ":" + today.getMinutes();

  		// Add missing zero 
  		function addZero(i) {
		  if (i < 10) {
		    i = "0" + i;
		  }
		  return i;
		}

		// Pass hour,minutes and secons through function and add zero
	    let h    = addZero(today.getHours()),
	        m    = addZero(today.getMinutes()),
	        s    = addZero(today.getSeconds()),
	        hour = h + ":" + m + ":" + s;
		
		// Scroll to top when page loads
		this.scrollToTop();

		// Generate random uuid and get string numbers from position 24 to the end (12 numbers)
			// This is used to target unique specific product
		let generateUuid = uuidv4(),
			transId      = generateUuid.substring(24,generateUuid.length);

		// Payment method selected & payment loading modal on
		this.setState({ chkPaymentLoading  : true,      // Loading effect while
						paymentMsgError    : false,     // If error msg was displayed, hide it
						completedOrderDate : todayDate, // Get time when transaction was completed
						completedOrderHour : hour,      // Get hour
						transactionId      : transId    // Set transaction id to be displayed
					})

		let cart 		 = this.props.cart,
			activeOrders = [];
			// Map through all cart products, get all usefull info about product. Create new product with the info and push it as an object to userDb myorders

		cart.forEach((prod) => {
			let product                    = {};
			product['status']              = 'In tranzit';
			product['img']                 = prod.moreImages[0];
			product['name']                = prod.name;
			product['productId']           = prod.id;
			product['orderedProductRefId'] = prod.refId;
			product['totalAmount']         = parseFloat(prod.totalAmount);
			product['quantity']            = parseFloat(prod.quantity);
			product['size']                = prod.selectedSize;
			product['color']               = prod.color;
			product['transactionId']       = transId;
			product['completedOrderDate']  = todayDate;
			product['completedOrderHour']  = hour;
			product['courierType']         = this.state.courierType;
			product['courierPrice']        = this.state.courierPrice;
			product['shippingAddress']     = this.state.addressName+' '+this.state.addressLastName+', '+this.state.addressStreet+', '+this.state.addressCity+', '+this.state.addressSubCity;
			product['phone']               = this.state.addressPhone;
			product['additionalInfo']      = this.state.addressAdditionalInfo;
			product['email']               = this.props.userDbInfo.data.email;    
			product['userDbAccountRefId']  = this.props.userDbInfo.ref.value.id;     

			// Push to existing userDb myorders array
			userDbInfo.push(product);
			// Push products to active orders array to be sent to database
			activeOrders.push(product);
		})
		// Send updated myorders to userDb database
		client.query(
		  q.Update(
		    q.Ref(q.Collection('users'), this.props.userDbInfo.ref.value.id),
		    { data: { 
		    		  myorders : userDbInfo,
		              cart     : [] }
		             }, // Set new order list and clear cart from database
		  )
		)
		.then((userDbInfoUpdated) => {
			// Call function to send orders to database
			this.sendActiveOrdesToDatabase(activeOrders);
			// Set new userDb info
			this.props.setUserDbInfo({ userDbInfo: userDbInfoUpdated })
			this.props.setCart({ cart: [] })
		})
		// If error, refresh window
		.catch((err) => { 
			console.log('Not sent: '+err)
			window.location.reload();
		})

	} else {
		this.setState({ paymentMsgError: true})
	}
}

/* __ Communicate with database  __ */

async sendActiveOrdesToDatabase(activeOrders) {
	// Modify ordered available product numbers from all the database products
	this.modifyProductsAvailableNumber(activeOrders);
	// Send all new orders to database active_orders section
	let get = await client.query(
	  q.Map(
	      activeOrders,
	    q.Lambda(
	      'active_orders',
	      q.Create(
	        q.Collection('active_orders'),
	        {  data: q.Var('active_orders') },
	      )
	    ),
	  )
	)
	.then(() => {})
	.catch((err) => {
			console.log('Error while trying to set active orders to database: '+err);
	})
}


async modifyProductsAvailableNumber(activeOrders) {
	// First, fetcha all products from database 
	let getMen = await getAllMenProducts
		.then((respMen) => {
			// Collect only data without database post reference
			let menProductData = respMen.map(el => el.data);

			let getWomen = getAllWomenProducts
				.then((respWomen) => {
					// Collect only data without database post reference
					let womenProductData = respWomen.map(el => el.data);
					
					let getChildren = getAllChildrenProducts
						.then((respChildren) => {
							// Collect only data without database post reference
							let childrenProductData = respChildren.map(el => el.data);

							let concat 		= [],
						        allProducts = [...concat,...menProductData, ...womenProductData, ...childrenProductData];
						
							// Map through user's orders
							for(let c in activeOrders) {
								// Search inside allproducts for the matching product to get updated data
								let getRefId = allProducts.forEach(el => {
									if(activeOrders[c].orderedProductRefId === el.refId) {
										// If product match with client's order id, update ordered product 'availableProductNo' from database
											// availableProductNo product minus user's ordered product quantity
												// In this way, every database availableProductNo will be recalculated depending of user's product ordered
										 client.query(
										  q.Update(
										    q.Ref(q.Collection(el.category), el.refId),
										    { data: { availableProductNo: el.availableProductNo - activeOrders[c].quantity } },
										  )
										)
										.then(() => {})
										.catch((err) => console.log(err))

									}
								})
							}
							// Payment loading modal off & confirm state (addressAndPaymentFinished) validated
							this.setState({chkPaymentLoading: false, addressAndPaymentFinished: true })
						})
				})
		})
}


backBtnFromSumar() {
	// Push page to homepage and refresh
	setTimeout(() => {
		window.location.reload();
	},500);
}


/* __ Actions after delivery method select __ */

checkDeliveryMethodPrice(courierPrice) {
	// Return price recalculated after selecting delivery method
	let totalCartAmount  = this.props.totalCartAmount,
		addDeliveryPrice = totalCartAmount + parseFloat(courierPrice);
		this.setState({ totalCartAmountWithDelivery: addDeliveryPrice })
}

fillAddressDelivery() {
	let userDbInfo = this.props.userDbInfo.data.shippingdata;
	// Check account user if has completed 'Address delivery' from user account 
	setTimeout(() => {
		// If userDb has shipping data info, set to state to be rendered inside
			// checkout shipping address inputs. Also, if there is data, set validity to true
			// If user will change any data, validity will change due to info match
		this.setState({
		addressLastName       : userDbInfo.lastname.length !== 0 ? userDbInfo.lastname : '' ,
		addressLastNameValid  : userDbInfo.lastname.length !== 0 ? true : false,
		addressName           : userDbInfo.name.length     !== 0 ? userDbInfo.name     : '',
		addressNameValid      : userDbInfo.name.length     !== 0 ? true : false,
		addressStreet         : userDbInfo.street.length   !== 0 ? userDbInfo.street+','+userDbInfo.postalCode : '',
		addressStreetValid    : userDbInfo.street.length   !== 0 ? true : false,
		addressCity           : userDbInfo.city.length     !== 0 ? userDbInfo.city     : '',
		addressCityValid      : userDbInfo.city.length     !== 0 ? true : false,
		addressSubCity        : userDbInfo.village.length  !== 0 ? userDbInfo.village  : '',
		addressSubCityValid   : userDbInfo.village.length  !== 0 ? true : false,
		addressAdditionalInfo : userDbInfo.addInfo.length  !== 0 ? userDbInfo.addInfo  : '',
		})

		// Map through city select DOM options and check value to be selected
		 
		let selCityOpt = document.querySelectorAll('.chk_city_opt_sel');
			selCityOpt.forEach((city) => {
				if(city.value === userDbInfo.city) {
					city.setAttribute('selected','selected');
					city.parentElement.setAttribute('style','border:1px solid #000; color:#000');
				}
			})
		 
		// Animate input label name to top to view the input value
		let addressInputs = document.querySelectorAll('.chk_addr_input');
			addressInputs.forEach((el) => {
				// If input value is not empty, animate input name label to top
				if(el.value.length > 0) {
					el.previousElementSibling.setAttribute('style','transform:translateY(-175%);font-size:12.5px;color:#7D7D7D;');
					el.setAttribute('style','border:1px solid #000');
				}  
			});
	},500);
}

 

	render() {

		// If user doesn't come from the Cart using 'Go to checkout' button, redirect.
		if(!this.props.cartIsLoaded && !this.props.cart.length > 0 || this.props.userDbInfo === null) {
			return (<Redirect to='/cart'/>)
		}

		if(this.state.cart === null) {
			return (<span>Încărcare...</span>)
		}

		// Style for checkout header steps
		const stepCheckedIcon        = {color:'#fff',backgroundColor:'#289b38'},
			  stepUncheckedIcon      = {color:'#000',backgroundColor:'#fff'},
			  stepCheckedText        = {fontWeight: 'bold'},
			  stepUncheckedText      = {fontWeight: 'normal'},
			  stepCheckedSeparator   = {border: '2px solid #289b38'},
			  stepUncheckedSeparator = {border: '2px solid #E4E4E4'};

		return (
				<div>

	                <div className='row justify-content-center'> 
						<div className='checkout_container col-12 col-md-11'>
							
							{/* Checkout steps */}
							<div className='row justify-content-center'>
								<div className='checkout_wrap_steps col-12 col-md-9'>
									<div className='row  justify-content-center'>
										<div className='chk_step_box'>
											<span className='chkstep_icon' style={this.state.deliveryChecked           ? stepCheckedIcon      : stepUncheckedIcon}>1</span>
											<span className='chkstep_txt'  style={this.state.deliveryChecked           ? stepCheckedText      : stepUncheckedText}>Livrare</span>
										</div>
										<span className='chk_separator'    style={this.state.deliveryChecked           ? stepCheckedSeparator : stepUncheckedSeparator}></span>
										 <div className='chk_step_box'>
											<span className='chkstep_icon' style={this.state.addressInputsValid        ? stepCheckedIcon      : stepUncheckedIcon}>2</span>
											<span className='chkstep_txt'  style={this.state.addressInputsValid        ? stepCheckedText      : stepUncheckedText}>Adresă</span>
										</div>
										<span className='chk_separator'    style={this.state.addressInputsValid        ? stepCheckedSeparator : stepUncheckedSeparator}></span>
										 <div className='chk_step_box'>
											<span className='chkstep_icon' style={this.state.addressAndPaymentFinished ? stepCheckedIcon      : stepUncheckedIcon}>3</span>
											<span className='chkstep_txt'  style={this.state.addressAndPaymentFinished ? stepCheckedText      : stepUncheckedText}>Plată</span>
										</div>
										<span className='chk_separator'    style={this.state.addressAndPaymentFinished ? stepCheckedSeparator : stepUncheckedSeparator}></span>
										 <div className='chk_step_box'>
											<span className='chkstep_icon' style={this.state.addressAndPaymentFinished ? stepCheckedIcon      : stepUncheckedIcon}>4</span>
											<span className='chkstep_txt'  style={this.state.addressAndPaymentFinished ? stepCheckedText      : stepUncheckedText}>Sumar</span>
										</div>
									
									</div>
								</div>
							</div>

							{/* Checkout wrap */}
							<div className='row justify-content-center'>
								<div className='checkout_wrap col-12'>
									<div className='row justify-content-center'>
										<div className='chk_sect col-12 col-lg-7 col-xl-8'>
											<div className='row'>
												<div className='chk_wrap_sec col-12 col-md-12 col-lg-11'>


													{/*  ---------------- CHECKOUT DELIVERY LIST  ----------------  */}
													{!this.state.deliveryChecked && (
													<React.Fragment>
														{this.state.deliveryMethodLoading && (
															<div className='chk_wrap_addr_loading_modal'>
																<div className='chk-wrap-lds-ring'><div></div><div></div><div></div><div></div></div>
															</div>
														)}
														<span className='chk_sec_title'>Metodă de livrare</span>

														{/* Normal delivery */}
														<div className='chk_deliver_select'>
															<div className='chk_check_del_check'>
																<i className='fas fa-truck-moving'></i>
																<label className="custom-control custom-radio">
																  <input className="custom-control-input" type="radio" onChange={(e)=>this.handleDeliverySelect(e, 'Curier clasic', '9.99')}/>
																  <div className="custom-control-label"></div>
																</label>
															</div>
															<div className='chk_check_del_info'>
																<span>Curier clasic</span>
																<span>3-5 zile lucrătoare</span>
																<span>9.99 RON</span>
															</div>
														</div>

														{/* Express delivery */}
														<div className='chk_deliver_select'>
															<div className='chk_check_del_check'>
																<img className='exp_del_icon' src={expressDelivery} alt='Express delivery'/>
																<label className="custom-control custom-radio">
																  <input className="custom-control-input" type="radio" onChange={(e)=>this.handleDeliverySelect(e,'Curier express','14.99')}/>
																  <div className="custom-control-label"></div>
																</label>
															</div>
															<div className='chk_check_del_info'>
																<span>Curier express</span>
																<span>1-3 zile lucrătoare</span>
																<span>14.99 RON</span>
															</div>
														</div>

														<div className='chk_wrap_delivery_buttons'>
															<Link to={'/'} className='chk_del_backtocart_btn'>
																<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
																</svg>
																Înapoi la coș
															</Link>
														</div>
													</React.Fragment>
													)}



													{/*  ----------------  CHECKOUT ADDRESS INPUTS  ----------------  */}
													{this.state.deliveryChecked && !this.state.addressInputsValid && (

													<div className='chk_wrap_address'>
														{this.state.chkAddressLoading && (
															<div className='chk_wrap_addr_loading_modal'>
																<div className='chk-wrap-lds-ring'><div></div><div></div><div></div><div></div></div>
															</div>
														)}
														<span className='chk_sec_title'>Adresă de livrare</span>

														{/* LAST NAME */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label'>Prenume *</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input'
															   autoComplete = 'off'
															   value        = {this.state.addressLastName}
															   onChange     = {(e) => this.handleAddressLastName(e)}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														{this.state.invalidLastNameMsg && (
														<span className='chk_addr_err_msg'>Prenume invalid</span>
														)}
														{/* ADDRESS NAME */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label'>Nume *</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input'
															   autoComplete = 'off'
															   value        = {this.state.addressName}
															   onChange     = {(e) => this.handleAddressName(e)}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														{this.state.invalidNameMsg && (
														<span className='chk_addr_err_msg'>Nume invalid</span>
														)}
														{/* ADDRESS PHONE */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label'>Număr telefon *</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input'
															   autoComplete = 'off'
															   maxLength    = '10'
															   value        = {this.state.addressPhone}
															   onChange     = {(e) => this.handleAddressPhone(e)}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														{this.state.invalidPhoneMsg && (
														<span className='chk_addr_err_msg'>Număr telefon invalid</span>
														)}
														{/* STREET ADDRESS  */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label'>Adresă completă *</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input'
															   autoComplete = 'off'
															   value        = {this.state.addressStreet}
															   onChange     = {(e) => this.handleAddressStreet(e)}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														<span className='chk_addr_note'>Ex: Stradă, număr, bloc, apartament, cod poștal</span>
														{this.state.invalidStreetMsg && (
														<span className='chk_addr_err_msg'>Adresă invalidă</span>
														)}
														{/* ADDRESS CITY */}
														<span className='chk_addr_wrapinput'>
															 <select className="custom-select form-control" onChange={(e)=>this.handleAddressCity(e)}>
															    {this.state.city.map((el,ind) =>
															    	<option className='chk_city_opt_sel'key={ind}>{el}</option>
															    )}
															</select>
														</span>
														{this.state.invalidCityMsg && (
														<span className='chk_addr_err_msg'>Județ invalid</span>
														)}

														{/* ADDRESS COUNTIES */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label'>Oraș / comună / sat *</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input'
															   autoComplete = 'off'
															   value        = {this.state.addressSubCity}
															   onChange     = {(e) => this.handleAddressSubCity(e)}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														{this.state.invalidSubCityMsg && (
														<span className='chk_addr_err_msg'>Câmp invalid</span>
														)}
														{/* ADDRESS ADDITIONAL INFo */}
														<span className='chk_addr_wrapinput'>
															<label className='chk_inp_label_addinfo'>Informații adiționale (opțional)</label>
															<input type     = 'text' 
															   className    = 'chk_addr_input chk_add_inp_addinfo'
															   autoComplete = 'off'
															   value        = {this.state.addressAdditionalInfo}
															   onChange     = {(e) => {this.setState({ addressAdditionalInfo: e.target.value })}}
															   onFocus      = {(e) => this.onAddressFocus(e)} 
															   onBlur       = {()  => this.onAddressBlur()}>
															</input>
														</span>
														<span className='chk_addr_note'>Ex: etajul sau numele firmei</span>

														<div className='addr_checkout_buttons'>
															<span className='addr_chk_backtocart_btn' onClick={()=>this.addressBackBtn()}>
																<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
																</svg>
																Înapoi
															</span>
															<Link to={'/checkout'} className='addr_chk_proceed_btn' onClick={() => this.handleAddrProceedBtn()}>
																Continuă
																<svg className="bi bi-arrow-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"/>
																</svg>
															</Link>
														</div>
													</div>
													)}
													

													{/*  ---------------- CHECKOUT SELECT PAYMENT METHOD  ---------------- */}

													{this.state.addressInputsValid && !this.state.addressAndPaymentFinished && (
													<div className='chk_wrap_payment'>
														{/* Loading payment modal */}
														{this.state.chkPaymentLoading && (
														<div className='chk_wrap_addr_loading_modal'>
															<div className='chk-wrap-lds-ring'><div></div><div></div><div></div><div></div></div>
														</div>
														)}
														<span className='chk_sec_title'>Metodă de plată</span>

														<div className='chk_cashondelivery_option'>
															<span className='chs_cashondel_check'>
																<label className="custom-control custom-radio">
																  <input className="custom-control-input" type="radio" onChange={()=>{this.setState({paymentChecked: true,paymentMsgError: false})}}/>
																  <div className="custom-control-label"></div>
																</label>
															</span>
															<span className='chs_cashondel_icon'>
																<img src={cashOnDeliveryIcon} alt='Cash on delivery'/>
															</span>
															<span className='chs_cashondel_txt'>
																 <span>Plată la livrare</span>
															</span>
														</div>

														{/* Select delivery method error message */}
														{this.state.paymentMsgError && (
														<span className='chk_selectdelivery_error_msg'>
															<svg className="bi bi-exclamation-circle-fill" width="1.3em" height="1.3em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
															  <path fillRule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8 4a.905.905 0 00-.9.995l.35 3.507a.552.552 0 001.1 0l.35-3.507A.905.905 0 008 4zm.002 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
															</svg>
															<span>Selectează metoda de livrare</span>
														</span>
														)}

														<div className='chk_seldel_termsandcont_div'>
															<label className='custom-control custom-checkbox'>
															  <input className='custom-control-input' type='checkbox' onChange={(e) => { this.setState({ payementAgreeTerms: e.target.checked })}}/>
															  <div className='custom-control-label chk_seldel_agreeterms_txt'>
															  	Atunci când apeși pe 'Plasează comanda', comanda ta va fi plasată. Când comanzi de pe Tshirtdesign.ro ești de acord cu <Link to={'/terms'} target='_blank' rel='noopener noreferrer'>Termenii și Condițiile</Link>.
															  </div>
															</label>
														</div>

														{/* Back and proceed buttons */}
														<div className='addr_checkout_buttons'>
															<span className='addr_chk_backtocart_btn' onClick={()=>this.backBtnFromPayment()}>
																<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
																</svg>
																Înapoi
															</span>
															{this.state.paymentChecked && this.state.payementAgreeTerms ? (
															/* Payment proceed available button */
															<span className='addr_chk_proceed_btn' onClick={()=>this.handleFinishOrderBtn()}>
																Plasează comandă
																<svg className="bi bi-arrow-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"/>
																</svg>
															</span>
															):(
															/* Payment proceed unavailable button */
															<span className='addr_chk_proceed_unavailable'>
																Plasează comandă
																<svg className="bi bi-arrow-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"/>
																</svg>
															</span>
															)}
														</div>
													</div>		
													)}



													{/* ---------------- CHECKOUT SUMAR ----------------  */}

													{this.state.addressInputsValid &&  (
													<div className='checkout_sumar'>
														<span className='chk_sec_title'>Sumar</span>

														<div className='wrap_checkout_sumar'>
															<svg className="bi bi-check-circle" width="4em" height="4em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
															  <path fillRule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clipRule="evenodd"/>
															  <path fillRule="evenodd" d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z" clipRule="evenodd"/>
															</svg>
															<span className='wr_chk_green'>Comandă realizată cu succes.</span>
															<span className='wr_chk_green mb-5'>Mulțumim!</span>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>ID Tranzacție:</span>
																<span className='wr_chk_sum_value'>{this.state.transactionId}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Data/ora:</span>
																<span className='wr_chk_sum_value'>{this.state.completedOrderDate}, {this.state.completedOrderHour}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Destinatar</span>
																<span className='wr_chk_sum_value'>{this.state.addressLastName} {this.state.addressName}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Telefon:</span>
																<span className='wr_chk_sum_value'>{this.state.addressPhone}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Adresă:</span>
																<span className='wr_chk_sum_value'>{this.state.addressStreet} {this.state.addressCity}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Comună/oraș/sat</span>
																<span className='wr_chk_sum_value'>{this.state.addressSubCity}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Alte informații</span>
																<span className='wr_chk_sum_value'>{this.state.addressAdditionalInfo.length > 0 ? this.state.addressAdditionalInfo : '-'}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Metodă livrare</span>
																<span className='wr_chk_sum_value'>{this.state.courierType === 'Curier clasic' ? 'Curier clasic ( 2-5 zile lucratoare )' : 'Curier express ( 1-3 zile lucratoare )'}</span>
															</div>
															<div className='wr_chk_sum'>
																<span className='wr_chk_sum_label'>Metodă plată</span>
																<span className='wr_chk_sum_value'>Ramburs</span>
															</div>
															<div className='wr_chk_sum wr_chk_sum_total_lab'>
																<span className='wr_chk_sum_label'>Total plată</span>
																<span className='wr_chk_sum_value'><strong>{this.state.totalCartAmountWithDelivery.toFixed(2)} lei</strong></span>
															</div>
														</div>

														{/* Sumar info note */}
														<div className='chk_sumar_info_note'>
															<span className='chk_sumar_note'>
																Poți urmării detaliile comenzilor plasate in secțiunea 'Comenzile mele'.
															</span>
															<span className='chk_sumar_note'>
																Dacă ați întampinat probleme în procesarea comenzii, va rugăm să ne trimiteți 
																un email la <a href='mailto:contact@tshirtdesign.ro'>contact@tdesign.ro </a> 
																sau să sunați la numărul de telefon <span className='sumar_infonote_phone'>0727 464 5671 </span>.
															</span>
														</div>

														{/* Sumar back to homepage button */}
														<div className='addr_checkout_buttons '>
															<Link to={'/'} className='addr_chk_backtocart_btn chk_sumar_back_btn' onClick={this.backBtnFromSumar}>
																<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
																  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
																</svg>
																Pagina principală
															</Link>
														</div>
													</div>
													)}

												</div>
											</div>
										</div>

										{/* Right container - display products / amount */}
										<div className='chk_sect_display_products chk_sect col-12 order-first order-lg-0 col-lg-5 col-xl-4'>
											<div className='row justify-content-center'>
												<div className='checkout_sec_display_cart_prod'>
													{/* Total products sum */}
													<div className='chk_sec_displayprod'>
														<span className='chk_sec_dprod_label'>Total</span>
														<span className='chk_sec_dprod_val'>{this.state.totalCartAmount.toFixed(2)} lei</span>
													</div>
													{/* Delivery cost */}
													<div className='chk_sec_displayprod'>
														<span className='chk_sec_dprod_label'>{!this.state.courierType.length > 0 ? 'Livrare' : this.state.courierType}</span>
														<span className='chk_sec_dprod_val'>{!this.state.courierPrice.length > 0 ? 'de la 9.99 lei' : this.state.courierPrice+' lei'}</span>
													</div>
													{/* Total with TVA */}
													<div className='chk_sec_displayprod chk_sec_totaltva'>
														<span className='chk_sec_dprod_label'><strong>Total</strong> cu TVA</span>
														<span className='chk_sec_dprod_val'><strong>{this.state.totalCartAmountWithDelivery.toFixed(2)} lei</strong></span>
													</div>
													
													{/* Display products */}
													<span className='chk_sec_dprod_title'>Comanda ta <span>{this.state.cart.length} {this.state.cart.length === 1 ? 'articol' : 'articole'}</span></span>

													<div className='chk_wrap_display_products'>
														{this.state.cart.length > 0 && this.state.cart.map((prod,ind) =>
														<div key={ind} className='chk_wrap_dprod_box'>
															<span className='chk_wrap_dprod_box_img'>
															<img src={prod.img} alt='' className='chkwrap_prodbox_img'/>
															</span>
															<span className='chk_wrap_dprod_box_data'>
																<span className='chks_wdprod_boxd_title'>{prod.name}</span>
																<span className='chks_wdprod_boxd_subtitle'>Marime: {prod.selectedSize}</span>
																<span className='chks_wdprod_boxd_subtitle chkswp_bsub_color'>Culoare: <span style={{backgroundColor: prod.color}}></span></span>
																<span className='chks_wdprod_boxd_sub_quant'>x<span>{prod.quantity}</span></span>
																<span className='chks_wdprod_boxd_price'>{prod.totalAmount.toFixed(2)} lei</span>
															</span>
														</div>
														)}
													</div>
												</div>


											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			)
	}
}

const Checkout = connect(mapStateToProps,mapDispatchToProps)(connectedCheckout);
export default Checkout;