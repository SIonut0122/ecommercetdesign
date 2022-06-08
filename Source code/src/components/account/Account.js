import   React            from 'react';
import   AccountMenu      from './AccountMenu';
import { Link, Redirect } from 'react-router-dom';
import { setUserDbInfo  } from '../../actions';
import { connect        } from "react-redux";
import { client, q      } from '../../fauna/db';
import '../../css/Account.css';



const mapStateToProps = state => {
  return {  
  		  userIsSignedIn    : state.userIsSignedIn,
  		  userInfo          : state.userInfo,
  		  signedWithGoogle  : state.signedWithGoogle,
  		  userDbInfo        : state.userDbInfo
        };
};


function mapDispatchToProps(dispatch) {
  return { setUserDbInfo : userDB => dispatch(setUserDbInfo(userDB)) };
}


class connectedAccount extends React.Component {

	state = {
			componentIsLoading: false,

			signedWithGoogle: true,
			userDbInfo: this.props.userDbInfo,

			emailAddress: '',
			emailAddressValid: true,
			emailAddressErrMsg: false,

			lastNameAddress: '',
			lastNameAddressValid: true,
			lastNameAddressErrMsg: false,

			nameAddress: '',
			nameAddressValid: true,
			nameAddressErrMsg: false,

			sexProfile: '',

			phoneAddress: '',
			phoneAddressValid: true,
			phoneAddressErrMsg: false,

			updatePassword: '',
			updatePasswordValid: true,
			updatePasswordErrMsg: false,

			changePassMinSixChar: false,
			changePassReauthentication: false,

			updateConfPass: '',
			updateConfPassValid: true,
			updateConfPassErrMsg: false,

			passwordMatchErrMsg: false,

			confirmProfileUpdates: false,
			confirmProfileUpdatesError: false,

	}

 componentDidMount() {
 	// Get userDbinfo myprofile data on every mount
 	if(this.props.userDbInfo !== null) {
		this.updateStateWithUserDbInfo(this.props.userDbInfo.data);
		console.log('Account info: Called from didMount');
	}
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}


componentDidUpdate(prevProps) {
	// Update signedwith google state if was not updated when the page loads
	if(prevProps.signedWithGoogle !== this.props.signedWithGoogle) { 
		this.setState({ signedWithGoogle: this.props.signedWithGoogle, componentIsLoading: false})
	}
	// If user has inserted manually the URL, watch changes and update user state inputs info
	if(prevProps.userDbInfo !== this.props.userDbInfo) {
		this.updateStateWithUserDbInfo(this.props.userDbInfo.data);
		console.log('Account info: Called from didUpdate');
	}
}



updateStateWithUserDbInfo(userDbInfo) {
	// Update state from userDbInfo to be used
	this.setState({
		lastNameAddress : userDbInfo.myprofile.lastname,
		nameAddress     : userDbInfo.myprofile.name,
		sexProfile      : userDbInfo.myprofile.gender,
		phoneAddress    : userDbInfo.myprofile.phone
	})


	// Select all gender DOM options and set attribute 'selected' to option with 
		// the userDbinfo gender value 
	let selGenOpt = document.querySelectorAll('.acc_gend_opt');
		selGenOpt.forEach((el) => {
			if(el.value === userDbInfo.myprofile.gender) {
				console.log('gasit:'+userDbInfo.myprofile.gender);
				el.setAttribute('selected','selected');
			}
		})
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
	        this.setState({ lastNameAddress: '', lastNameAddressValid: true })
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
	        this.setState({ nameAddress: '', nameAddressValid: true })
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
				this.updateAccountProfile();
		  	} else {
				this.setState({ confirmProfileUpdates: false, passwordMatchErrMsg: true })
		  	
			}
	}

}

updateAccountProfile() {

	// UPDATE PASSWORD //

	 var user = firebase.auth().currentUser;

	 // If passwords values are the same, check if the length to proceed
	 if(this.state.updatePassword.length > 0 && this.state.updateConfPass.length > 0) {
		 user.updatePassword(this.state.updateConfPass)
		 	.then(() => {
		    // If password match, hide all errors
		    this.setState({ changePassReauthentication: false,changePassMinSixChar:false,passwordMatchErrMsg:false })
			})
			.catch((error) => {
			  if(error.code === 'auth/weak-password') {
			  	// Display 'Password must have at least 6 char' and hide the rest of messages
			  	this.setState({ changePassMinSixChar: true, changePassReauthentication: false, passwordMatchErrMsg: false })
			  } else if(error.code === 'auth/requires-recent-login') {
			  	// Display 'Please reauthenticate to update password' message
			  	this.setState({ changePassReauthentication: true })
			  }
		});
	}

	// UPDATE PROFILE INFO //

	// If password was unchanged or was changed without errors, proceed with account info change
	if(!this.state.changePassReauthentication && !this.state.changePassMinSixChar && !this.state.passwordMatchErrMsg) {
		// Update user account info
		let userDbInfo = this.props.userDbInfo.data,
		    { lastNameAddress,nameAddress,sexProfile,phoneAddress} = this.state;

		let myprofileUpdated = {
			lastname : lastNameAddress !== userDbInfo.myprofile.lastname ? lastNameAddress : userDbInfo.myprofile.lastname,
			name     : nameAddress     !== userDbInfo.myprofile.name     ? nameAddress     : userDbInfo.myprofile.name,
			gender   : sexProfile      !== userDbInfo.myprofile.gender   ? sexProfile      : userDbInfo.myprofile.gender,
			phone    : phoneAddress    !== userDbInfo.myprofile.phone    ? phoneAddress    : userDbInfo.myprofile.phone  
		}

	 	this.updateUserDbProfile(myprofileUpdated, this.props.userDbInfo.ref.value.id);
	}

}

updateUserDbProfile(updateUserDBProfile,id) {

  	client.query(
	  q.Update(
	    q.Ref(q.Collection('users'), id),
	    { data: { myprofile: updateUserDBProfile} },
	  )
	)
	.then((resp) => { 
			this.props.setUserDbInfo({ userDbInfo: resp })
			// Display confirm message
			this.setState({ confirmProfileUpdates: true, confirmProfileUpdatesError: false })
			setTimeout(() => {
				this.setState({ confirmProfileUpdates: false })
			},4000);
			console.log('MY PROFILE WAS UPDATED')
		})
	.catch(() => {
		this.setState({ confirmProfileUpdatesError: true, confirmProfileUpdates: false })
	})
}



handleSignOut() {
 	firebase.auth().signOut().then(() => {
	  window.location.reload();
	}).catch(function(error) {
	  console.log('An error occurred while signing out');
	});
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
			return ( <Redirect to={'/login'}/>)
		}



		document.title = 'Profilul meu - Tshirt Design';
		
		let disableEnable = this.props.signedWithGoogle ? {disabled: 'disabled'} : {};
		return (
				<div>
					{/* Navigation */}
	                <div className='row justify-content-center'>
		                <div className='nav_path_cont col-11'>
		                 <span>
		                 	<Link to={'/'} className='nav_path_home'>
		                  	Acasă 
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
									<span>Contul meu</span>
									<span className='acc_title_signout_btn' onClick={()=>this.handleSignOut()}>
										Ieși din cont <i className="fas fa-sign-out-alt"></i>
									</span>
								</span>
							</div>

							{/* RIGHT ACCOUNT MENU */}
							<div className='row justify-content-center'>
								<div className='account_sec acc_sec_menu_right col-12 col-lg-4'>
										<AccountMenu 
											location     ='myprofile' 
											name         ='Profilul meu'/>
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
											<span className='acc_profinputs_title'>Adresă de email (Logare in Magazin)</span>
											<span className='acc_profinput_wrap'>
												<input type='text'
													   disabled
													   className='acc_profinp_emailaddress'
													   onChange={(e) => this.updateEmailAddress(e)}
													   value={this.props.userInfo !== null && this.props.userInfo.email}/>
											</span>
											{this.state.emailAddressErrMsg && (
											<span className='acc_profinputs_err_msg'>Adresă de email invalidă</span>
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
												    	<option className='acc_gend_opt'>Sex</option>
												    	<option className='acc_gend_opt'>Feminin</option>
												    	<option className='acc_gend_opt'>Masculin</option>
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
											<span className='acc_profinputs_title'>Parolă</span>
											<span className='acc_profinput_wrap'>
												<input type='password'
													   className='acc_profinp_password'
													   onChange={(e) => this.updatePassword(e)}
													   value={this.state.updatePassword}
													   {...disableEnable}/>
											</span>
											{this.state.updatePasswordErrMsg && (
											<span className='acc_profinputs_err_msg'>Parolă invalidă</span>
											)}
											{this.state.passwordMatchErrMsg && (
											<span className='acc_profinputs_err_msg'>Parolele nu coincid</span>
											)}
											{this.state.changePassReauthentication && (
											<span className='acc_profinputs_err_msg'>Pentru a actualiza parola, reloghează-te</span>
											)}


											{/* Confirm Password */}
											<span className='acc_profinputs_title'>Repetă parola</span>
											<span className='acc_profinput_wrap'>
												<input type='password'
													   className='acc_profinp_password'
													   onChange={(e) => this.updateConfirmPassword(e)}
													   value={this.state.updateConfPass}
													   {...disableEnable}/>
											</span>
											{this.state.updateConfPassErrMsg && (
											<span className='acc_profinputs_err_msg'>Parola nu este identică</span>
											)}
											{this.state.passwordMatchErrMsg && (
											<span className='acc_profinputs_err_msg'>Parolele nu coincid</span>
											)}
											{this.state.changePassMinSixChar && (
											<span className='acc_profinputs_err_msg'>Parola trebuie să aiba minimum 6 caractere</span>
											)}


											{/* Save profile updates button */}
											<span className='acc_updateprofile_btn' onClick={() =>this.handleSaveUpdatesBtn()}>Salvează modificările</span>
											
											{/* Save profile updates confirm message */}
											{this.state.confirmProfileUpdates && (
											<span className='acc_updateprofil_confirm_msg'>* Modificările au fost salvate</span>
											)}

											{/* Save shipping updates error message */}
											{this.state.confirmProfileUpdatesError && (
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


 
const Account = connect(mapStateToProps,mapDispatchToProps)(connectedAccount);
export default Account;

 