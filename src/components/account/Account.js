import React from 'react';
import '../../css/Account.css';
import { Link               } from 'react-router-dom'
import AccountMenu from './AccountMenu';




class Account extends React.Component {

	state = {
			componentIsLoading: true,

			emailAddress: 'sionut0122@yahoo.com',
			emailAddressValid: true,
			emailAddressErrMsg: false,

			lastNameAddress: 'Ionut',
			lastNameAddressValid: true,
			lastNameAddressErrMsg: false,

			nameAddress: 'Stan',
			nameAddressValid: true,
			nameAddressErrMsg: false,

			sexProfile: '',

			phoneAddress: '',
			phoneAddressValid: true,
			phoneAddressErrMsg: false,

			updatePassword: '',
			updatePasswordValid: true,
			updatePasswordErrMsg: false,

			updateConfPass: '',
			updateConfPassValid: true,
			updateConfPassErrMsg: false,

			passwordMatchErrMsg: false,

			confirmProfileUpdates: false,
			confirmProfileUpdatesError: false

	}


componentDidMount() {
	document.title = 'Profilul meu - Tshirt Design';
	setTimeout(() => { this.setState({ componentIsLoading: false })},1000)
}

updateEmailAddress(e) {
	  let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
          emailValue = e.target.value;

      // If input mail match, setstate value
      if(emailValue.length > 0 && !emailValue.match(mailformat)) {
      	this.setState({emailAddress: emailValue, emailAddressValid: false})
    } else if(emailValue.match(mailformat)) {
        this.setState({emailAddress: emailValue, emailAddressValid: true, emailAddressErrMsg: false})
    } else if(emailValue.length === 0) {
      // If input is empty, reset value input
        this.setState({emailAddress: '', emailAddressValid: false})
    } else {
        this.setState({emailAddress: '', emailAddressValid: false})
    }
}

updateLastNameAddress(e) {
	 let lastNameValue       = e.target.value,
           // Check last name characters
         checkLastName       =  lastNameValue.split('').every(x => x.match(/[a-zA-Z ]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces     =  lastNameValue.split('').every(x => x.match(/[ ]+/g)),
           // Check last name length to be at least 2
         checkLastNameLength = lastNameValue.length >= 2;


	    if(checkLastName && checkLastNameLength && !onlyBlankSpaces) {
	        this.setState({ lastNameAddress: lastNameValue, lastNameAddressValid: true, lastNameAddressErrMsg: false })
	    } else if(lastNameValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ lastNameAddress: '', lastNameAddressValid: false })
	    } else {
	        this.setState({ lastNameAddress: lastNameValue, lastNameAddressValid: false })
	    }		
}

updateNameAddress(e) {
	 let nameValue       = e.target.value,
           // Check name characters
         checkName       =  nameValue.split('').every(x => x.match(/[a-zA-Z]+/g)),
           // Check for input not to be only blank spaces
         onlyBlankSpaces =  nameValue.split('').every(x => x.match(/[ ]+/g)),
           // Check name length to be at least 2
         checkNameLength = nameValue.length >= 2;


	    if(checkName && checkName && !onlyBlankSpaces) {
	        this.setState({ nameAddress: nameValue, nameAddressValid: true, nameAddressErrMsg: false })
	    } else if(nameValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({ nameAddress: '', nameAddressValid: false })
	    } else {
	        this.setState({ nameAddress: nameValue, nameAddressValid: false })
	    }	
}

updateSex(e) {
	 this.setState({ sexProfile: e.target.value })	
}

updatePhoneAddress(e) {
	let phoneValue     = e.target.value,
        // Check phone characters
      checkPhone       =  phoneValue.split('').every(x => x.match(/[0-9]+/g)),
        // Check phoneValue length to be at least 10
      checkPhoneLength = phoneValue.length === 10,
       // Check for blank spaces
      checkWhiteSpaces = phoneValue.trim().length === phoneValue.length;


    if(checkPhone && checkPhoneLength && checkWhiteSpaces) {
        this.setState({phoneAddress: phoneValue, phoneAddressValid: true, phoneAddressErrMsg: false})
      } else if(phoneValue.length === 0) {
      // If input is empty, reset value input / Set addressinfovalid to false to hide Payment section
        this.setState({phoneAddress: '', phoneAddressValid: true, phoneAddressErrMsg: false})
      } else {
        this.setState({phoneAddress: phoneValue, phoneAddressValid: false})
    }
}
updatePassword(e) {
	let updatePassword   = e.target.value,
	   		// Check updatePassword length to be higher than 2
	    checkValueLength = updatePassword.length > 3,
	   		// Check for blank spaces
	    checkWhiteSpaces = updatePassword.trim().length === updatePassword.length;

    	// If updatePassword value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({updatePassword: updatePassword, updatePasswordValid: true, updatePasswordErrMsg: false})
    } else if(updatePassword.length === 0) {
      	// If input is empty, reset value input
        this.setState({updatePassword: '', updatePasswordValid: true, updatePasswordErrMsg: false})
    } else {
        this.setState({updatePassword: updatePassword, updatePasswordValid: false })
    }	

}

updateConfirmPassword(e) {
	let updateConfPassword = e.target.value,
	   		// Check updateConfPassword length to be higher than 2
	    checkValueLength   = updateConfPassword.length > 3,
	   		// Check for blank spaces
	    checkWhiteSpaces   = updateConfPassword.trim().length === updateConfPassword.length;

    	// If updateConfPassword value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({updateConfPass: updateConfPassword, updateConfPassValid: true, updateConfPassErrMsg: false })
    } else if(updateConfPassword.length === 0) {
      	// If input is empty, reset value input
        this.setState({updateConfPass: '', updateConfPassValid: true, updateConfPassErrMsg: false })
    } else {
        this.setState({updateConfPass: updateConfPassword, updateConfPassValid: false })
    }	
}

handleSaveUpdatesBtn() {
	// Reset all update account error messages
 	this.setState({ emailAddressErrMsg: false, lastNameAddressErrMsg: false, nameAddressErrMsg: false, phoneAddressErrMsg: false, updatePasswordErrMsg: false, updateConfPassErrMsg: false})
 	// Check for invalid inputs and display error message
 	switch(false){
 		case this.state.emailAddressValid:
 		this.setState({ emailAddressErrMsg: true })
 		break;
 		case this.state.lastNameAddressValid:
 		this.setState({ lastNameAddressErrMsg: true })
 		break;
 		case this.state.nameAddressValid:
 		this.setState({ nameAddressErrMsg: true })
 		break;
 		case this.state.phoneAddressValid:
 		this.setState({ phoneAddressErrMsg: true })
 		break;
 		case this.state.updatePasswordValid:
 		this.setState({ updatePasswordErrMsg: true })
 		break;
 		case this.state.updateConfPassValid:
 		this.setState({ updateConfPassErrMsg: true })
 		break;
 		default:
 			// If there is no errors, check if both passwords match
 			if(this.state.updatePassword === this.state.updateConfPass) {
				this.setState({ confirmProfileUpdates: true, passwordMatchErrMsg: false })
				this.updateAccountProfile();
		  	} else {
				this.setState({ confirmProfileUpdates: false, passwordMatchErrMsg: true })
		  	
			}
	}

}

updateAccountProfile() {
	 
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
										<AccountMenu location='myprofile' name='Profilul meu'/>
								</div>
								<div className='account_sec col-12 col-lg-8'>
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
										<div className='acc_prof_wrap_inputs'>

											{/* Email address */}
											<span className='acc_profinputs_title'>Adresa de email (Logare in Magazin)</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_emailaddress'
													   onChange={(e) => this.updateEmailAddress(e)}
													   value={this.state.emailAddress}/>
											</span>
											{this.state.emailAddressErrMsg && (
											<span className='acc_profinputs_err_msg'>Adresa de email invalida</span>
											)}


											{/* Lastname address */}
											<span className='acc_profinputs_title'>Prenume</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_lastnameAddress'
													   onChange={(e) => this.updateLastNameAddress(e)}
													   value={this.state.lastNameAddress}/>
											</span>
											{this.state.lastNameAddressErrMsg && (
											<span className='acc_profinputs_err_msg'>Prenume invalid</span>
											)}


											{/* Name address */}
											<span className='acc_profinputs_title'>Nume</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_nameAddress'
													   onChange={(e) => this.updateNameAddress(e)}
													   value={this.state.nameAddress}/>
											</span>
											{this.state.nameAddressErrMsg && (
											<span className='acc_profinputs_err_msg'>Nume invalid</span>
											)}


											{/* Sex select */}
											<span className='acc_profinputs_title'></span>
										 	<span className='acc_profinput_wrap acc_select_sex'>
												 <select className="custom-select form-control" onChange={(e)=>this.updateSex(e)}>
												    	<option>Sex</option>
												    	<option>Feminin</option>
												    	<option>Masculin</option>
												</select>
											</span>

											{/* Phone address */}
											<span className='acc_profinputs_title'>Telefon</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   className='acc_profinp_phoneAddress'
													   maxLength='10'
													   onChange={(e) => this.updatePhoneAddress(e)}
													   value={this.state.phoneAddress}/>
											</span>
											{this.state.phoneAddressErrMsg && (
											<span className='acc_profinputs_err_msg'>Telefon invalid</span>
											)}


											{/* Password */}
											<span className='acc_profinputs_title'>Parola</span>
											<span className='acc_profinput_wrap'>
												<input type='password'
													   className='acc_profinp_password'
													   onChange={(e) => this.updatePassword(e)}
													   value={this.state.updatePassword}/>
											</span>
											{this.state.updatePasswordErrMsg && (
											<span className='acc_profinputs_err_msg'>Parola invalida</span>
											)}
											{this.state.passwordMatchErrMsg && (
											<span className='acc_profinputs_err_msg'>Parolele nu coincid</span>
											)}


											{/* Confirm Password */}
											<span className='acc_profinputs_title'>Repeta parola</span>
											<span className='acc_profinput_wrap'>
												<input type='password'
													   className='acc_profinp_password'
													   onChange={(e) => this.updateConfirmPassword(e)}
													   value={this.state.updateConfPass}/>
											</span>
											{this.state.updateConfPassErrMsg && (
											<span className='acc_profinputs_err_msg'>Parola nu este identica</span>
											)}
											{this.state.passwordMatchErrMsg && (
											<span className='acc_profinputs_err_msg'>Parolele nu coincid</span>
											)}


											{/* Save profile updates button */}
											<span className='acc_updateprofile_btn' onClick={() =>this.handleSaveUpdatesBtn()}>Salveaza modificarile</span>
											
											{/* Save profile updates confirm message */}
											{this.state.confirmProfileUpdates && (
											<span className='acc_updateprofil_confirm_msg'>* Modificarile au fost salvate</span>
											)}

											{/* Save shipping updates error message */}
											{this.state.confirmProfileUpdatesError && (
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

export default Account;