import React from 'react';
import '../../css/Account.css';
import { Link               } from 'react-router-dom'
import AccountMenu from './AccountMenu';




class ShippingData extends React.Component {
	state = {
			componentIsLoading: true,

			shippLastName: 'Ionut',
			shippLastNameValid: true,
			shippLastNameErrMsg: false,

			shippName: 'Stan',
			shippNameValid: true,
			shippNameErrMsg: false,

			shippStreetAddr:'',
			shippStreetAddrValid: true,
			shippStreetAddrErrMsg: false,

			shippPostalCode: '',
			shippPostalCodeValid: true,
			shippPostalCodeErrMsg: false,

			shippCity: '',
			shippCityValid: true,
			shippCityErrMsg: false,

			shippAdditionalInfo: '',
			confirmShippingUpdates: false,
			confirmShippingUpdatesError: false,

	}


componentDidMount() {
	document.title = 'Date de livrare - Tshirt Design';
	setTimeout(() => { this.setState({ componentIsLoading: false })},1000)
}

updateShippLastName(e) {
     let lastName            = e.target.value,
           // Check last name characters
         checkLastName       =  lastName.split('').every(x => x.match(/[a-zA-Z]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces     =  lastName.split('').every(x => x.match(/[ ]+/g)),
           // Check last name length to be at least 2
         checkLastNameLength = lastName.length >= 2;


	    if(checkLastName && checkLastNameLength && !onlyBlankSpaces) {
	        this.setState({ shippLastName: lastName, shippLastNameValid: true, shippLastNameErrMsg: false })
	    } else if(lastName.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ shippLastName: '', shippLastNameValid: false })
	    } else {
	        this.setState({ shippLastName: lastName, shippLastNameValid: false })
	    }
}

updateShippName(e) {
	 let nameValue       = e.target.value,
           // Check shipp name characters
         checkName       =  nameValue.split('').every(x => x.match(/[a-zA-Z]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces =  nameValue.split('').every(x => x.match(/[ ]+/g)),
           // Check shipp name length to be at least 2
         checkNameLength = nameValue.length >= 2;


	    if(checkName && checkNameLength && !onlyBlankSpaces) {
	        this.setState({ shippName: nameValue, shippNameValid: false, shippNameErrMsg: false })
	    } else if(nameValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ shippName: '', shippNameValid: true })
	    } else {
	        this.setState({ shippName: nameValue, shippNameValid: false })
	    }
}

updateShippStreetAddr(e) {
	 let streetAddr         = e.target.value,
           // Check address name characters
         checkAddr          =  streetAddr.split('').every(x => x.match(/[a-zA-Z0-9-._ ]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces    =  streetAddr.split('').every(x => x.match(/[ ]+/g)),
           // Check shipp address name length to be at least 2
         checkAddressLength = streetAddr.length >= 2;


	    if(checkAddr && checkAddressLength && !onlyBlankSpaces) {
	        this.setState({ shippStreetAddr: streetAddr, shippStreetAddrValid: true, shippStreetAddrErrMsg: false })
	    } else if(streetAddr.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ shippStreetAddr: '', shippStreetAddrValid: true })
	    } else {
	        this.setState({ shippStreetAddr: streetAddr, shippStreetAddrValid: false })
	    }
}

updateShippPostalCode(e) {
	let postalCode       = e.target.value,
           // Check postal code characters
        checkPostalCode  = postalCode.split('').every(x => x.match(/[0-9]+/g)),
           // Check postal code to be higher than 2
        checkPostalCodeLength  = postalCode.length > 2,
           // Check for blank spaces
        checkWhiteSpaces = postalCode.trim().length === postalCode.length;


    if(checkPostalCode && checkPostalCodeLength && checkWhiteSpaces) {
        this.setState({shippPostalCode: postalCode, shippPostalCodeValid: true, shippPostalCodeErrMsg: false})
      } else if(postalCode.length === 0) {
        this.setState({shippPostalCode: '', shippPostalCodeValid: true})
      } else {
        this.setState({shippPostalCode: postalCode, shippPostalCodeValid: false})
    }

}

updateShippCity(e) {
	 let cityValue       = e.target.value,
           // Check city name characters
         checkCityValue  =  cityValue.split('').every(x => x.match(/[a-zA-Z]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces =  cityValue.split('').every(x => x.match(/[ ]+/g)),
           // Check city name length to be at least 2
         checkCityLength = cityValue.length >= 2;


	    if(checkCityValue && checkCityLength && !onlyBlankSpaces) {
	        this.setState({ shippCity: cityValue, shippCityValid: true, shippCityErrMsg: false })
	    } else if(cityValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ shippCity: '', shippCityValid: true })
	    } else {
	        this.setState({ shippCity: cityValue, shippCityValid: false })
	    }
}

updateShippAddInfo(e) {
	this.setState({ shippAdditionalInfo: e.target.value })
}

updateShippingDataBtn() {
	// Reset all update account error messages
 	this.setState({ shippLastNameErrMsg: false, shippNameErrMsg: false, shippStreetAddrErrMsg: false, shippPostalCodeErrMsg: false, shippCityErrMsg: false })
 	// Check for invalid inputs and display error message
 	switch(false){
 		case this.state.shippLastNameValid:
 		this.setState({ shippLastNameErrMsg: true })
 		break;
 		case this.state.shippNameValid:
 		this.setState({ shippNameErrMsg: true })
 		break;
 		case this.state.shippStreetAddrValid:
 		this.setState({ shippStreetAddrErrMsg: true })
 		break;
 		case this.state.shippPostalCodeValid:
 		this.setState({ shippPostalCodeErrMsg: true })
 		break;
 		case this.state.shippCityValid:
 		this.setState({ shippCityErrMsg: true })
 		break;
 		default:
 			this.setState({ confirmShippingUpdates: true })
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
		                  	Contul meu
		                  </span>
		                </div>    
	                </div>

					<div className='row justify-content-center'> 
						<div className='account_container col-11'>

							{/* Account title */}
							<div className='row justify-content-center'>
								<span className='account_title col-11'>
									Contul meu
								</span>
							</div>

							<div className='row justify-content-center'>
								<div className='account_sec acc_sec_menu_right col-12 col-lg-4'>
										<AccountMenu location='shippingdata' name='Date de livrare'/>
								</div>
								<div className='account_sec shipping_sec col-12 col-lg-8'>

									{/* Account loading modal */}
									{this.state.componentIsLoading && (
									<div className='account_loading_modal'>
										<div className='row justify-content-center h-100'>
											<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
										</div>
									</div>
									)}

									{/* Account profile content */}
									<div className='row'>
										<div className='acc_prof_wrap_inputs shipp_update_cont_inputs'>

											{/* Last name address */}
											<span className='acc_profinputs_title'>Prenume</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shipplastname'
													   onChange={(e) => this.updateShippLastName(e)}
													   value={this.state.shippLastName}/>
											</span>
											{this.state.shippLastNameErrMsg && (
											<span className='acc_profinputs_err_msg'>Prenume invalid</span>
											 )}


											 {/* Shipp name */}
											<span className='acc_profinputs_title'>Nume</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shipplastname'
													   onChange={(e) => this.updateShippName(e)}
													   value={this.state.shippName}/>
											</span>
											{this.state.shippNameErrMsg && (
											<span className='acc_profinputs_err_msg'>Nume invalid</span>
											)}


											{/* Shipp Street address */}
											<span className='acc_profinputs_title'>Numele strazii</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippstreeetname'
													   onChange={(e) => this.updateShippStreetAddr(e)}
													   value={this.state.shippStreetAddr}/>
											</span>
											{this.state.shippStreetAddrErrMsg && (
											<span className='acc_profinputs_err_msg'>Adresa invalida</span>
											)}


											{/* Shipp postal code */}
											<span className='acc_profinputs_title'>Cod postal</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   maxLength='10'
													   className='acc_profinp_shipppostalcode'
													   onChange={(e) => this.updateShippPostalCode(e)}
													   value={this.state.shippPostalCode}/>
											</span>
											{this.state.shippPostalCodeErrMsg && (
											<span className='acc_profinputs_err_msg'>Cod Postal invalid</span>
											)}
											<a target='_blank' rel='noopener noreferrer' href='https://www.posta-romana.ro/cauta-cod-postal.html' className='check_postal_code'>Cauta cod postal <i className='fas fa-angle-right'></i></a>

											{/* Shipp city */}
											<span className='acc_profinputs_title'>Oras</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippcity'
													   onChange={(e) => this.updateShippCity(e)}
													   value={this.state.shippCity}/>
											</span>
											{this.state.shippCityErrMsg && (
											<span className='acc_profinputs_err_msg'>Oras invalid</span>
											)}

										 	{/* Shipp additional info */}
											<span className='acc_profinputs_title'>Informatii aditionale</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippadditinfo'
													   onChange={(e) => this.updateShippAddInfo(e)}
													   value={this.state.shippAdditionalInfo}/>
											</span>

									 
											{/* Save shipping updates button */}
											<span className='acc_updateprofile_btn' onClick={() =>this.updateShippingDataBtn()}>Salveaza modificarile</span>
											
											{/* Save shipping updates confirm message */}
											{this.state.confirmShippingUpdates && (
											<span className='acc_updateprofil_confirm_msg'>* Modificarile au fost salvate</span>
											)}

											{/* Save shipping updates error message */}
											{this.state.confirmShippingUpdatesError && (
											<span className='acc_updateprofil_error_msg'>* A intervenit o eroare. Reincearca.</span>
											)}


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

export default ShippingData;