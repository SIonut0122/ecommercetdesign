import   React            from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect        } from "react-redux";
import '../css/Login.css';
 
 

const mapStateToProps = state => {
  return { userIsSignedIn   : state.userIsSignedIn };
};



class connectedLogin extends React.Component {

	state = {
			loginLoadingEffect   : true,
			openForgotPassCont   : false,
			loginEmail           : '',
			loginEmailValid      : false,
			invalidLoginEmailMsg : false,
			loginPassword        : '',
			loginPasswordValid   : false,
			invalidLoginPassMsg  : false,
			forgotPassEmailInput : '',
			forgotPassErrMsg     : false,
			forgotPassConfirmMsg : false,

	}

componentDidMount() {
	// Display loading effect for 1 sec
	 setTimeout(() => { this.setState({ loginLoadingEffect: false }) },1000);
}


/* Login section */
handleLoginEmail(e) {
  let loginEmailValue = e.target.value,
      // Check loginEmailValue length to be higher than 0
      checkValueLength = loginEmailValue.length > 0,
      // Check for blank spaces
      checkWhiteSpaces = loginEmailValue.trim().length === loginEmailValue.length;

    // if email value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({loginEmail: loginEmailValue, loginEmailValid: true})
    } else if(loginEmailValue.length === 0) {
      // If input is empty, reset value input
        this.setState({loginEmail: '', loginEmailValid: false})
    } else {
        this.setState({loginEmail: loginEmailValue, loginEmailValid: false})
    }
}

handleLoginPassword(e) {
	  let loginPasswordValue = e.target.value,
	   		 // Check signinPasswordValue length to be higher than 0
	      checkValueLength = loginPasswordValue.length > 4,
	   		 // Check for blank spaces
	      checkWhiteSpaces = loginPasswordValue.trim().length === loginPasswordValue.length;

        	// if password value match, setstate value 
	    if(checkValueLength && checkWhiteSpaces) {
	        this.setState({loginPassword: loginPasswordValue, loginPasswordValid: true})
	    } else if(loginPasswordValue.length === 0) {
	      	// If input is empty, reset value input
	        this.setState({loginPassword: '', loginPasswordValid: false})
	    } else {
	        this.setState({loginPassword: loginPasswordValue, loginPasswordValid: false})
	    }
}

onLoginFocus(e) {
	// Animate label input (Email,Password) and change input border on focus
	e.target.parentElement.firstElementChild.setAttribute('style','transform:translateY(-150%);font-size:12.5px;color:#4B4B4B;');
	e.target.setAttribute('style','border:1px solid #000');
}

onLoginBlur(e) {
	// Handle click outside login inputs and animate to bottom label (Email,Password) if empty
	let loginInputs = document.querySelectorAll('.log_txt_input');
	loginInputs.forEach((el) => {
		// If input is empty, animate label back and set default input border color
		if(el.value.length === 0) {
			el.previousElementSibling.removeAttribute('style');
			el.removeAttribute('style');
		}
	});
}

showHidePassword(e) {
	const loginInputPassword = document.querySelector('.log_txt_input_pass');

	let checkAttribute = loginInputPassword.getAttribute('type');
	// Check and change input type
	if(checkAttribute === 'password') {
		loginInputPassword.setAttribute('type','text');
		e.target.style.opacity = '1';
	} else {
		loginInputPassword.setAttribute('type','password');
		e.target.style.opacity = '0.7';
	}
	loginInputPassword.focus();
}

handleLoginInputKey(e) {
	if(e.key === 'Enter' || e.keyCode === 13) {
		this.handleLoginBtn();
	}
}

handleLoginBtn() {
	if(!this.state.loginEmailValid && this.state.loginPasswordValid) {
		this.setState({ invalidLoginEmailMsg: true, invalidLoginPassMsg: false})
	} else if(this.state.loginEmailValid && !this.state.loginPasswordValid) {
		this.setState({ invalidLoginEmailMsg: false, invalidLoginPassMsg: true})
	} else if (!this.state.loginEmailValid && !this.state.loginPasswordValid) {
		this.setState({ invalidLoginEmailMsg: true, invalidLoginPassMsg: true})
	} else {
		this.setState({ invalidLoginEmailMsg: false, invalidLoginPassMsg: false})
		// Login user
		this.signIn();
	}
}



/* FORGOT PASSWORD */

handleForgotPassInput(e) {
   let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
       emailValue = e.target.value;

      // If input mail match, setstate value
    if(emailValue.match(mailformat)) {
        this.setState({forgotPassEmailInput: emailValue, forgotPassEmailInputValid: true})
    } else if(emailValue.length === 0) {
      // If input is empty, reset value input
        this.setState({forgotPassEmailInput: '', forgotPassEmailInputValid: false})
    } else {
        this.setState({forgotPassEmailInput: '', forgotPassEmailInputValid: false})
    }
}

handleForgotPassInputKey(e) {
   // If user press enter on forgotpass input, call function
  if(e.key === 'Enter' || e.keyCode === 13) {
    this.handleResetPasswordBtn();
  }
}

handleResetPasswordBtn() {
	// If forgot pass input value is not invalid, proceed
	if(this.state.forgotPassEmailInputValid) {
        firebase.auth().sendPasswordResetEmail(this.state.forgotPassEmailInput)
      .then(() => {
  		// Display 'email sent' message and clear all forgotpass inpu
  		this.setState({ forgotPassConfirmMsg: true, forgotPassErrMsg: false,forgotPassEmailInput: '',forgotPassEmailInputValid: false })
  	   })
      .catch((err) => {
        // If email was not found inside database, display message
        if(err.code === 'auth/user-not-found') {
          this.setState({ forgotPassConfirmMsg: false, forgotPassErrMsg: true  })
        }
      })
  	} else {
  		this.setState({ forgotPassConfirmMsg: false, forgotPassErrMsg: true })
  	}
}


/* Sign in methods */

signIn() {
   	 // Sign in with normal method
	 firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
    .then(() => {
    	/*window.location.reload();*/
    	console.log('USER IS SIGNED IN');
     }).catch((error) => {
      console.log('Error while trying to sign in: '+error);
  });  
}

googlePlusConnect() {
	// Create google auth provider
let provider = new firebase.auth.GoogleAuthProvider();
	// Open popup window to signin Google+
	firebase.auth().signInWithPopup(provider).then((result) => {
	 // Console.log results if you need info about user
	 	// Referesh after log in
	   window.location.reload();
	}).catch(function(error) {
		console.log(error);
	});
}


	render() {

	    // If user is not signed in, redirect to login page
		if(this.props.userIsSignedIn === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		} else if(this.props.userIsSignedIn) {
			return ( <Redirect to={'/account'}/> )
		} 


		document.title = 'Conectare - Tshirt Design';
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
	                  	Conectare
	                  </span>
	                </div>    
                </div>

				<div className='row justify-content-center'> 
					<div className='login_container col-11'>

						{/* Loading effect */}
						{this.state.loginLoadingEffect && (
							<div className='login_cont_loading'>
								<div className='row justify-content-center h-100'>
									<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
								</div>
							</div>
						)}
						<div className='row justify-content-center'>
							<div className='login_cont_sect login_sect_box col-12 col-md-6 col-lg-6'>
								<div className='row'>
									<div className='login_cont_wrap'>
										<span className='log_title_font'>Ai deja cont ?</span>
										<span className='log_title_font_two'>
											Conectează-te <span className='log_subtitle_font'>pentru a gestiona comenzile cu ușurință!</span>
										</span>
										{/* Login inputs */}
										<div className='row justify-content-center'>
											<div className='login_sec_inputs'>

												{/* Email login input */}
												<div className='row justify-content-center'>
													<span className='log_input_wrapper'>
														<label>Email</label>
														<input type         = 'text' 
															   className    = 'log_txt_input'
															   autoComplete = 'off'
															   value        = {this.state.loginEmail}
															   onChange     = {(e) => this.handleLoginEmail(e)}
															   onFocus      = {(e) => this.onLoginFocus(e)} 
															   onBlur       = {(e) => this.onLoginBlur(e)}
															   onKeyDown    = {(e) => this.handleLoginInputKey(e)}>
														</input>
													</span>
												</div>

												{/* Invalid email or email not found */}
												{this.state.invalidLoginEmailMsg && (
												<div className='row justify-content-center'>
													<span className='login_err_msg'>Email invalid</span>
												</div>
												)}

												{/* Password login input */}
												<div className='row justify-content-center'>
													<span className='log_input_wrapper'>
														<label>Password</label>
														<input type         = 'password' 
															   className    = 'log_txt_input log_txt_input_pass' 
															   autoComplete = 'off'
															   value        = {this.state.loginPassword}
															   onChange     = {(e) => this.handleLoginPassword(e)}
															   onFocus 		= {(e) => this.onLoginFocus(e)} 
															   onBlur       = {(e) => this.onLoginBlur(e)}
															   onKeyDown    = {(e) => this.handleLoginInputKey(e)}>
														</input>
														
														<i className='far fa-eye log_showhide_icon' title='Show / Hide password' onClick={(e) => this.showHidePassword(e)}></i>
													</span>
												</div>

												{/* User not found or invalid pass */}
												{this.state.invalidLoginPassMsg && (
												<div className='row justify-content-center'>
													<span className='login_err_msg'>Utilizator inexistent sau parolă greșită</span>
												</div>
												)}
												<div className='row justify-content-center'>
													<span className='login_forgotpass_button' onClick={() => { this.setState({openForgotPassCont:true})}}>Mi-am uitat parola</span>
												</div>

												{/* Login button */} 
												<div className='row justify-content-center'>
													<span className='login_button' onClick={()=>this.handleLoginBtn()}>Conectează-te</span>
												</div> 
												<div className='row justify-content-center'>
													<span className='log_title_or'>Sau conectează-te cu</span>
												</div>
												{/* Google plus button */ }
												<div className='row justify-content-center'>
													<span className='log_with_google_plus_button' onClick={()=>this.googlePlusConnect()}>
														<i className='fab fa-google-plus-g'></i>
														Google+
													</span>
												</div>

											</div>
										</div>
							
									</div>
								</div>
							</div>

							{/* Register section */}
							<div className='login_newmember_cont_sect login_sect_box col-md-6 col-12 col-lg-6'>
								<div className='row'>
									<div className='login_newmember_wrap'>
										<div className='row justify-content-center'>
											<span className='log_title_font'>Prima ta vizita ?</span>
										</div>
										<div className='row justify-content-center'>
											<Link to={'/register'} className='log_register_button'>Înregistrează-te</Link>
										</div>
										<div className='row justify-content-center'>
											<span className='log_regtitle_benefits col-11'>Și vei beneficia de:</span>
										</div>
										<div className='row justify-content-center'>
											<div className='log_register_benefitsbox col-11'>
												<span><i className='fas fa-percent'></i> Discounturi și multe alte oferte</span>
												<span><i className='far fa-user'></i>Gestionează și actualizează datele tale personale</span>
												<span><i className='fas fa-history'></i>Acces ușor la istoricul comenzilor</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{this.state.openForgotPassCont && (
				<div className='forgot_password_container' onClick={() => { this.setState({openForgotPassCont:false})}}>
					<div className='row justify-content-center'>
						<div className='forgot_pass_box col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4' onClick={(e)=>{e.stopPropagation()}}>
							
						 
							<svg className="bi bi-x close_forgotpass_cont" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={() => { this.setState({openForgotPassCont:false,forgotPassErrMsg:false,forgotPassConfirmMsg:false})}}>
							  <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
							  <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
							</svg>
							 

							<div className='row'>
								<span className='forgotpass_title col-12'>Mi-am uitat parola</span>
							</div>
							<div className='row'>
								<span className='forgotpass_subtitle col-12'>
									Introdu adresa de e-mail furnizată când te-ai înregistrat și noi îți vom trimite o nouă parolă imediat:
								</span>
							</div>
							<div className='row'>
								<span className='forgotpass_input_wrap'>
									<input type='text' 
										   placeholder='Email' 
										   onChange={(e)=>this.handleForgotPassInput(e)}
										   onKeyDown={(e)=>this.handleForgotPassInputKey(e)}></input>
								</span>
							</div>
							{this.state.forgotPassErrMsg && (
							<div className='row'>
								<span className='forgotpass_err_msg'>Email inexistent sau invalid.</span>
							</div>
							)}
							{this.state.forgotPassConfirmMsg && (
							<div className='row'>
								<span className='forgotpass_snet_msg'>Noua parolă a fost trimisă la e-mailul indicat.</span>
							</div>
							)}
							<div className='row'>
								<span className='send_newpass_btn' onClick={()=>this.handleResetPasswordBtn()}>Trimite</span>
							</div>
						</div>
					</div>
				</div>
				)}
			</div>
		)
	}
}

 
const Login = connect(mapStateToProps,null)(connectedLogin);
export default Login;

 