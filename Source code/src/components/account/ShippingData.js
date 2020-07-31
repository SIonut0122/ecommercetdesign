import   React            from 'react';
import { Link, Redirect } from 'react-router-dom'
import { setUserDbInfo  } from '../../actions';
import { connect        } from "react-redux";
import { client, q      } from '../../fauna/db';
import   AccountMenu      from './AccountMenu';
import '../../css/Account.css';



const mapStateToProps = state => {
  return {  
  		  userIsSignedIn : state.userIsSignedIn,
  		  userDbInfo     : state.userDbInfo
        };
};

function mapDispatchToProps(dispatch) {
  return {
            setUserDbInfo : userDB => dispatch(setUserDbInfo(userDB))
        };
}



class connectedShippingData extends React.Component {
	state = {
			city                        : ['Județ *','Alba','Arad','Argeș','Bacău','Bihor','Bistrița-Năsăud','Botoșani','Brașov','Brăila','Buzău','Caraș-Severin','Călărași','Cluj', 'Constanța','Covasna','Dâmbovița','Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov','Maramureș', 'Mehedinți','Mureș','Neamț','Olt','Prahova','Satu Mare','Sălaj','Sibiu','Suceava','Teleorman','Timiș','Tulcea','Vaslui','Vâlcea', 'Vrancea'],
			componentIsLoading          : true,
			shippLastName               : '',
			shippLastNameValid          : true,
			shippLastNameErrMsg         : false,
			shippName                   : '',
			shippNameValid              : true,
			shippNameErrMsg             : false,
			shippStreetAddr             :'',
			shippStreetAddrValid        : true,
			shippStreetAddrErrMsg       : false,
			shippPostalCode             : '',
			shippPostalCodeValid        : true,
			shippPostalCodeErrMsg       : false,
			shippCity                   : '',
			shippCityValid              : true,
			shippCityErrMsg             : false,
			shippVillage                : '',
			shippVillageValid           : true,
			shippVillageErrMsg          : false,
			shippAdditionalInfo         : '',
			confirmShippingUpdates      : false,
			confirmShippingUpdatesError : false,

	}


componentDidMount() {
	// Get userDbinfo shipping data on every mount
 	if(this.props.userDbInfo !== null) {
		this.updateStateWithUserDbInfo(this.props.userDbInfo.data);
	}
}

componentDidUpdate(prevProps) {
	// If user has inserted manually the URL, watch changes and update user state inputs info
	if(prevProps.userDbInfo !== this.props.userDbInfo) {
		this.updateStateWithUserDbInfo(this.props.userDbInfo.data);
	}
}

updateStateWithUserDbInfo(userDbInfo) {
	// Update state from userDbInfo to be used
	this.setState({
		shippLastName       : userDbInfo.shippingdata.lastname,
		shippName           : userDbInfo.shippingdata.name,
		shippStreetAddr     : userDbInfo.shippingdata.street,
		shippPostalCode     : userDbInfo.shippingdata.postalCode,
		shippCity           : userDbInfo.shippingdata.city,
		shippVillage        : userDbInfo.shippingdata.village,
		shippAdditionalInfo : userDbInfo.shippingdata.addInfo
	})

	let selCityOpt = document.querySelectorAll('.acc_shpdat_city_opt_sel');
		selCityOpt.forEach((city) => {
			if(city.value === userDbInfo.shippingdata.city) {
				city.setAttribute('selected','selected');
			}
		})
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
	        this.setState({ shippName: nameValue, shippNameValid: true, shippNameErrMsg: false })
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
         checkAddr          =  streetAddr.split('').every(x => x.match(/[a-zA-Z0-9-.,()_ ]+/g)),
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
	let postalCode             = e.target.value,
           // Check postal code characters
        checkPostalCode        = postalCode.split('').every(x => x.match(/[0-9]+/g)),
           // Check postal code to be higher than 2
        checkPostalCodeLength  = postalCode.length > 2,
           // Check for blank spaces
        checkWhiteSpaces       = postalCode.trim().length === postalCode.length;

    if(checkPostalCode && checkPostalCodeLength && checkWhiteSpaces) {
        this.setState({shippPostalCode: postalCode, shippPostalCodeValid: true, shippPostalCodeErrMsg: false})
      } else if(postalCode.length === 0) {
        this.setState({shippPostalCode: '', shippPostalCodeValid: true})
      } else {
        this.setState({shippPostalCode: postalCode, shippPostalCodeValid: false})
    }

}

updateShippCity(e) {
	if(e.target.value !== 'Județ *') {
		 this.setState({shippCity: e.target.value, shippCityValid: true, shippCityErrMsg: false})
	} else {
		this.setState({shippCity: '', shippCityValid: false})
	}
}

updateShippVillage(e) {
	let villageValue       = e.target.value,
           // Check city name characters
        checkVillageValue  =  villageValue.split('').every(x => x.match(/[a-zA-Z]+/g)),
           // Check for input not to be only blank spaces
        onlyBlankSpaces    =  villageValue.split('').every(x => x.match(/[ ]+/g)),
           // Check city name length to be at least 2
        checkVillageLength =  villageValue.length >= 2;

	    if(checkVillageValue && checkVillageLength && !onlyBlankSpaces) {
	        this.setState({ shippVillage: villageValue, shippVillageValid: true, shippVillageErrMsg: false })
	    } else if(villageValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ shippVillage: '', shippVillageValid: true })
	    } else {
	        this.setState({ shippVillage: villageValue, shippVillageValid: false })
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
 			this.updateShippingdDataDb();
	}
}

updateShippingdDataDb() {
	
	// Update user account info
	let userDbInfo = this.props.userDbInfo.data,
	    { shippLastName,shippName,shippStreetAddr,shippPostalCode,shippCity,shippVillage, shippAdditionalInfo } = this.state;

	let newShippingData = {
		lastname   : shippLastName       !== userDbInfo.myprofile.lastname   ? shippLastName       : userDbInfo.myprofile.lastname,
		name       : shippName           !== userDbInfo.myprofile.name       ? shippName           : userDbInfo.myprofile.name,
		street     : shippStreetAddr     !== userDbInfo.myprofile.street     ? shippStreetAddr     : userDbInfo.myprofile.street,
		postalCode : shippPostalCode     !== userDbInfo.myprofile.postalCode ? shippPostalCode     : userDbInfo.myprofile.postalCode, 
		city       : shippCity           !== userDbInfo.myprofile.city       ? shippCity           : userDbInfo.myprofile.city,
		village    : shippVillage        !== userDbInfo.myprofile.village    ? shippVillage        : userDbInfo.myprofile.village,
		addInfo    : shippAdditionalInfo !== userDbInfo.myprofile.addInfo    ? shippAdditionalInfo : userDbInfo.myprofile.addInfo
	}

 	this.updateUserDbShippData(newShippingData, this.props.userDbInfo.ref.value.id);
}

updateUserDbShippData(newShippingData,id) {
	// Target id inside database and update user shippingdata info
	client.query(
	  q.Update(
	    q.Ref(q.Collection('users'), id),
	    { data: { shippingdata: newShippingData} },
	  )
	)
	.then((resp) => { 
		this.props.setUserDbInfo({ userDbInfo: resp })
		// Display confirm message
		this.setState({ confirmShippingUpdates: true, confirmShippingUpdatesError: false })
		// Hide confirm msg after 4 sec
		setTimeout(() => {
			this.setState({ confirmShippingUpdates: false })
		},4000);
	})
	.catch(() => {
		this.setState({ confirmShippingUpdatesError: true,})
	})
}

	render() {

		// If user is not signed in, redirect to login page
		if(this.props.userIsSignedIn === null && this.props.userDbInfo !== null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		} else if(!this.props.userIsSignedIn) {
			return ( <Redirect to={'/login'}/> )
		}

		// Set document title if user is logged in
		document.title = 'Date de livrare - Tshirt Design';

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
											<span className='acc_profinputs_title'>Numele străzii</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippstreeetname'
													   onChange={(e) => this.updateShippStreetAddr(e)}
													   value={this.state.shippStreetAddr}/>
											</span>
											{this.state.shippStreetAddrErrMsg && (
											<span className='acc_profinputs_err_msg'>Adresă invalidă</span>
											)}


											{/* Shipp postal code */}
											<span className='acc_profinputs_title'>Cod poștal</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   maxLength='10'
													   className='acc_profinp_shipppostalcode'
													   onChange={(e) => this.updateShippPostalCode(e)}
													   value={this.state.shippPostalCode}/>
											</span>
											{this.state.shippPostalCodeErrMsg && (
											<span className='acc_profinputs_err_msg'>Cod poștal invalid</span>
											)}
											<a target='_blank' rel='noopener noreferrer' href='https://www.posta-romana.ro/cauta-cod-postal.html' className='check_postal_code'>Cauta cod postal <i className='fas fa-angle-right'></i></a>


											{/* Shipp city */}
											<span className='acc_profinputs_title'>Oraș</span>
											<span className='acc_profinput_wrap'>
												 <select className="custom-select form-control acc_profinp_shippcity" onChange={(e)=>this.updateShippCity(e)}>
												    {this.state.city.map((el,ind) =>
												    	<option className='acc_shpdat_city_opt_sel' key={ind}>{el}</option>
												    )}
												</select>
											</span>
										 
											{this.state.shippCityErrMsg && (
											<span className='acc_profinputs_err_msg'>Oraș invalid</span>
											)}

										{/* Shipp village */}
											<span className='acc_profinputs_title'>Sat / comună</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippvillage'
													   onChange={(e) => this.updateShippVillage(e)}
													   value={this.state.shippVillage}/>
											</span>
											{this.state.shippVillageErrMsg && (
											<span className='acc_profinputs_err_msg'>Câmp invalid</span>
											)}

										 	{/* Shipp additional info */}
											<span className='acc_profinputs_title'>Informații adiționale</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_shippadditinfo'
													   onChange={(e) => this.updateShippAddInfo(e)}
													   value={this.state.shippAdditionalInfo}/>
											</span>

									 
											{/* Save shipping updates button */}
											<span className='acc_updateprofile_btn' onClick={() =>this.updateShippingDataBtn()}>Salvează modificările</span>
											
											{/* Save shipping updates confirm message */}
											{this.state.confirmShippingUpdates && (
											<span className='acc_updateprofil_confirm_msg'>* Modificările au fost salvate</span>
											)}

											{/* Save shipping updates error message */}
											{this.state.confirmShippingUpdatesError && (
											<span className='acc_updateprofil_error_msg'>* A intervenit o eroare. Reîncearcă.</span>
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

const ShippingData = connect(mapStateToProps,mapDispatchToProps)(connectedShippingData);
export default ShippingData;