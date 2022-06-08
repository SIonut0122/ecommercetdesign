import   React            from 'react';
import { connect }        from 'react-redux';
import { Link, Redirect } from 'react-router-dom'
import { setUserDbInfo  } from '../actions';
import { client, q      } from '../fauna/db';
import '../css/Register.css'


 
const mapStateToProps = state => {
  return { userIsSignedIn   : state.userIsSignedIn };
};

function mapDispatchToProps(dispatch) {
  return { setUserDbInfo : userDB  => dispatch(setUserDbInfo(userDB)) };
}


class connectedRegister extends React.Component {

		state = {
			regEmail                  : '',
			regEmailValid             : false,
			regEmailErrMsg            : false,
			regLastName               : '',
			regLastNameValid          : false,
			regLastNameErrMsg         : false,
			regName                   : '',
			regNameValid              : false,
			regNameErrMsg             : false,
			regPassword               : '',
			regPasswordValid          : false,
			regPasswordErrMsg         : false,
			regSex                    : null,
			regAcceptNewsletter       : false,
			regAcceptTerms            : false,
			regAcceptTermsErrMsg      : false,
			regNewAccountLoad         : false,
			registerEmailAlreadyInUse : false
		}



componentDidMount() {
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}

handleRegEmail(e) {
	let regEmailValue  = e.target.value,
           // Check regEmailValue length to be higher than 0
      checkValueLength = regEmailValue.length > 0,
           // Check for blank spaces
      checkWhiteSpaces = regEmailValue.trim().length === regEmailValue.length;

        // if email value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({regEmail: regEmailValue, regEmailValid: true, regEmailErrMsg: false })
    } else if(regEmailValue.length === 0) {
      // If input is empty, reset value input
        this.setState({regEmail: '', regEmailValid: false})
    } else {
        this.setState({regEmail: regEmailValue, regEmailValid: false})
    }
}
handleRegLastName(e) {
	let regLastName      = e.target.value,
	   		// Check regLastName length to be higher than 2
	    checkValueLength = regLastName.length > 2,
	   		// Check for blank spaces
	    checkWhiteSpaces = regLastName.trim().length === regLastName.length;

    	// If regLastName value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({regLastName: regLastName, regLastNameValid: true, regLastNameErrMsg: false})
    } else if(regLastName.length === 0) {
      	// If input is empty, reset value input
        this.setState({regLastName: '', regLastNameValid: false})
    } else {
        this.setState({regLastName: regLastName, regLastNameValid: false})
    }	
}
handleRegName(e) {
	let regName          = e.target.value,
	   		// Check regName length to be higher than 2
	    checkValueLength = regName.length > 2,
	   		// Check for blank spaces
	    checkWhiteSpaces = regName.trim().length === regName.length;

    	// if regName value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({regName: regName, regNameValid: true, regNameErrMsg: false})
    } else if(regName.length === 0) {
      	// If input is empty, reset value input
        this.setState({regName: '', regNameValid: false})
    } else {
        this.setState({regName: regName, regNameValid: false})
    }	
}

handleRegPassword(e) {
 	let regPasswordValue = e.target.value,
   		   // Check password length to be higher than 4
      checkValueLength   = regPasswordValue.length > 4,
   		   // Check for blank spaces
      checkWhiteSpaces   = regPasswordValue.trim().length === regPasswordValue.length;

    	// If password value match, setstate value 
    if(checkValueLength && checkWhiteSpaces) {
        this.setState({regPassword: regPasswordValue, regPasswordValid: true, regPasswordErrMsg: false })
    } else if(regPasswordValue.length === 0) {
      	// If input is empty, reset value input
        this.setState({regPassword: '', regPasswordValid: false})
    } else {
        this.setState({regPassword: regPasswordValue, regPasswordValid: false})
    }
}

showHidePassword(e) {
	let regInputPassword = document.querySelector('.reg_txt_input_pass'),
	    checkAttribute   = regInputPassword.getAttribute('type');

	// Check and change input type
	if(checkAttribute === 'password') {
		regInputPassword.setAttribute('type','text');
		e.target.style.opacity = '1';
	} else {
		regInputPassword.setAttribute('type','password');
		e.target.style.opacity = '0.7';
	}
	   // Focus on input on every change
	   regInputPassword.focus();
}
handleRegSex(e) {
	if(e.target.value !== 'Sex') {
		this.setState({ regSex: e.target.value })
	}
}

onRegFocus(e) {
	// Animate label input (Email,Password etc.) and change input border on focus
	e.target.parentElement.firstElementChild.setAttribute('style','transform:translateY(-162%);font-size:13px;color:#4B4B4B;');
	e.target.setAttribute('style','border:1px solid #000');
}

onRegBlur() {
	// Handle click outside login inputs and animate to bottom label (Email,Password etc.) if empty
	let loginInputs = document.querySelectorAll('.reg_txt_input');
	loginInputs.forEach((el) => {
		// If input is empty, animate label back and set default input border color
		if(el.value.length === 0) {
			el.previousElementSibling.removeAttribute('style');
			el.removeAttribute('style');
		}
	});
}

handleRegisterBtn() {
	// Reset all register error messages
 	this.setState({ regNameErrMsg: false,regLastNameErrMsg: false, regPasswordErrMsg: false, regEmailErrMsg: false, regAcceptTermsErrMsg: false })
 	// Check for invalid inputs and display error message
 	switch(false){
 		case this.state.regEmailValid:
 		this.setState({ regEmailErrMsg: true })
 		break;
 		case this.state.regLastNameValid:
 		this.setState({ regLastNameErrMsg: true })
 		break;
 		case this.state.regNameValid:
 		this.setState({ regNameErrMsg: true })
 		break;
 		case this.state.regPasswordValid:
 		this.setState({ regPasswordErrMsg: true })
 		break;
 		case this.state.regAcceptTerms:
 		this.setState({ regAcceptTermsErrMsg: true })
 		break;
 		default:
 		// If everything is good, create account
 		this.createAccount();
 	}
}


/* Create normal account */

createAccount() {
	// Display loading effect
	this.setState({ regNewAccountLoad: true})

	  firebase.auth().createUserWithEmailAndPassword(this.state.regEmail, this.state.regPassword)
      .then(() => {
        // Call function to update user info (username)
        this.updateNewAccountInfo();
        // If 'email already is use' message is displayed, hide it
        this.setState({ registerEmailAlreadyInUse: false })
        console.log('USER WAS CREATED');
      
      }).catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
        	console.log('email alrdeay in use');
        	// Hide loading effect is error
           this.setState({ registerEmailAlreadyInUse: true, regNewAccountLoad: false })
        }
    })
}

updateNewAccountInfo() {
	let user = firebase.auth().currentUser;
		user.updateProfile({
	      // Use displayName to store the Username
	      displayName: this.state.regLastName
	    }).then(() => {
	     	this.createNewDbUser(user);
	    })
}

createNewDbUser(userAuth) {

	let newUserData = {
		  email        : userAuth.email.toLowerCase(),
		  uid          : userAuth.uid,
		  displayName  : userAuth.displayName,
		  cart         : null,
		  wishlist     : null,
		  myprofile    : {lastname:'',name:'',gender:'',phone:''},
		  myorders     : null,
		  shippingdata : {lastname:'',name:'',street:'',postalCode:'',city:'',village:'',addInfo:''}
	};

	// Create a new user with those prop on database
	client.query(
	  q.Create(
	    q.Collection('users'),
	    { data: newUserData },
	  )
	)
	.then(() => { window.location.reload() })
	.catch((err) => {
		console.log('Something went wrong while creatint new user');
	})

}

/* Register with Google+ */

googlePlusConnect() {
	// Create google auth provider
	let provider = new firebase.auth.GoogleAuthProvider();
		// Open popup window to signin Google+
		firebase.auth().signInWithPopup(provider).then(() => {
		 // Console.log results if you need info about user
		 window.location.reload();
		}).catch(function(error) {
			console.log(error);
		});
}



	render() {

		if(this.props.userIsSignedIn) {
			return (<Redirect to={'/account'}/>)
		}

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
	                  	Înregistrare
	                  </span>
	                </div>    
                </div>

				<div className='row justify-content-center'> 
					<div className='register_container col-11'>

						{/* Loading modal */}
						{this.state.regNewAccountLoad && (
						<div className='register_loading_modal'>
							<div className='reg_load_modal'>
								<span>Se creează contul</span>
								<div className='reg_load_eff'>
									<div></div><div></div><div></div><div></div>
								</div>
							</div>
						</div>
						)}

						{/* Wishlist title */}
						<div className='row justify-content-center'>
							<span className='wishlist_title col-11'>
								Înregistrare
							</span>
						</div>

						{/* Register with google+ */}
						<div className='row justify-content-center'>
							<span className='reg_with_google_plus_btn' onClick={() => this.googlePlusConnect()}>
								<i className='fab fa-google-plus-g'></i>
								Google+ connect
							</span>
						</div>

						<div className='row justify-content-center'>
							<div className='reg_inputs col-11'>

								<span className='reg_newaccount_title'>Cont nou</span>
								<span className='reg_newaccount_subtitle'>Completează câmpurile de mai jos pentru a crea un cont.</span>
								{/* Email reg input */}
								<span className='reg_input_wrapper'>
									<label>Email *</label>
									<input type         = 'text' 
										   className    = 'reg_txt_input'
										   autoComplete = 'off'
										   value        = {this.state.regEmail}
										   onChange     = {(e) => this.handleRegEmail(e)}
										   onFocus      = {(e) => this.onRegFocus(e)} 
										   onBlur       = {(e) => this.onRegBlur(e)}>
									</input>
								</span>
								{this.state.regEmailErrMsg && (
							 	<span className='reg_err_msg'>Email invalid</span>
							 	)}
							 	{this.state.registerEmailAlreadyInUse && (
							 	<span className='reg_err_msg'>Acest email este deja înregistrat</span>
							 	)}


							 	{/* Last name reg input */}
								<span className='reg_input_wrapper'>
									<label>Prenume *</label>
									<input type         = 'text' 
										   className    = 'reg_txt_input'
										   autoComplete = 'off'
										   value        = {this.state.regLastName}
										   onChange     = {(e) => this.handleRegLastName(e)}
										   onFocus      = {(e) => this.onRegFocus(e)} 
										   onBlur       = {(e) => this.onRegBlur(e)}>
									</input>
								</span>
								{this.state.regLastNameErrMsg && (
							 	<span className='reg_err_msg'>Prenume invalid</span>
							 	)}


							 	{/* Name reg input */}
								<span className='reg_input_wrapper'>
									<label>Nume *</label>
									<input type         = 'text' 
										   className    = 'reg_txt_input'
										   autoComplete = 'off'
										   value        = {this.state.regName}
										   onChange     = {(e) => this.handleRegName(e)}
										   onFocus      = {(e) => this.onRegFocus(e)} 
										   onBlur       = {(e) => this.onRegBlur(e)}>
									</input>
								</span>
								{this.state.regNameErrMsg && (
							 	<span className='reg_err_msg'>Nume invalid</span>
							 	)}


							 	{/* Password reg input */}
								<span className='reg_input_wrapper'>
									<label>Parolă *</label>
									<input type         = 'password' 
										   className    = 'reg_txt_input reg_txt_input_pass'
										   autoComplete = 'off'
										   value        = {this.state.regPassword}
										   onChange     = {(e) => this.handleRegPassword(e)}
										   onFocus      = {(e) => this.onRegFocus(e)} 
										   onBlur       = {(e) => this.onRegBlur(e)}>
									</input>

									<i className='far fa-eye reg_showhide_icon' title='Show / Hide password' onClick={(e) => this.showHidePassword(e)}></i>
								</span>
								{this.state.regPasswordErrMsg && (
							 	<span className='reg_err_msg'>Parolă invalidă</span>
							 	)}


							 	{/* Reg sex select */}
							 	<span className='reg_input_wrapper'>
									 <select className="custom-select form-control" onChange={(e)=>this.handleRegSex(e)}>
									    	<option>Sex</option>
									    	<option>Feminin</option>
									    	<option>Masculin</option>
									</select>
								</span>

								{/* Reg newsletter select */}
								<span className='reg_newsletter_title'>Newsletter</span>

								<div className='reg_agree_newsletter_div'>
									<label className='custom-checkbox'>
									  <input className='custom-control-input' type='checkbox' onChange={(e) => { this.setState({ regAcceptNewsletter: e.target.checked })}}/>
									  <div className='custom-control-label reg_newsletter_txt'>
									  		Sunt de acord să primesc de la tshirtdesign S.A. pe adresa de email, informaţii 
											comerciale referitoare la această companie, precum și a partenerilor ei, în conformitate cu <Link to={'/terms'} target='_blank' rel='noopener noreferrer'>regulamentul</Link>. 
									  </div>
									</label>
								</div>


								{/* Reg agree terms */}
								<div className='reg_agree_terms_div'>
									<label className='custom-checkbox'>
									  <input className='custom-control-input' type='checkbox' onChange={(e) => { this.setState({ regAcceptTerms: e.target.checked })}}/>
									  <div className='custom-control-label reg_terms_txt'>
									  		Am citit și sunt de acord cu <Link to={'/terms'} target='_blank' rel='noopener noreferrer'>Regulamentul</Link> magazinului.  
									  </div>
									</label>
								</div>
								{this.state.regAcceptTermsErrMsg && (
								<span className='reg_err_msg'>Trebuie să accepți regulamentul magazinului</span>
								)}

								<span className='reg_createacc_btn' onClick={()=>this.handleRegisterBtn()}>Înregistrează-te</span>

							</div>
						</div>
					</div>
				</div>

			</div>
		)
	}
}


const Register = connect(mapStateToProps,mapDispatchToProps)(connectedRegister);
export default Register;