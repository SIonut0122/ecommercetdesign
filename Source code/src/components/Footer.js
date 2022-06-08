import   React       from 'react';
import { Link      } from 'react-router-dom'
import { client, q } from '../fauna/db';
import '../css/Footer.css';


class Footer extends React.Component {

		state = {
			newsletterInput           : '',
			newsletterInputValid      : '',
			newsletterConfirmMsg      : false,
			newsletterInvalidEmailMsg : false,
			newsletterAlreadyMsg      : false,
		}



handleNewsletterChange(e) {
	  let mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
          emailValue = e.target.value;

      // If input mail match, setstate value
      if(emailValue.length > 0 && !emailValue.match(mailformat)) {
      	this.setState({newsletterInput: emailValue, newsletterInputValid: false})
	    } else if(emailValue.match(mailformat)) {
	        this.setState({newsletterInput: emailValue, newsletterInputValid: true, newsletterInvalidEmailMsg: false})
	    } else if(emailValue.length === 0) {
	      // If input is empty, reset value input
	        this.setState({newsletterInput: '', newsletterInputValid: false})
	    } else {
	        this.setState({newsletterInput: '', newsletterInputValid: false})
	    }
}

handleNewsletterButton() {
	// If newsletter input value is valid, hide error messages and call function to fetch all newsletter emails
	if(this.state.newsletterInputValid) {
		this.setState({ newsletterInvalidEmailMsg: false, newsletterErrorCreate: false })
		this.getAllNewsletterEmails(this.state.newsletterInput);
	} else {
		this.setState({ newsletterConfirmMsg: false,newsletterInvalidEmailMsg: true })
	}
}

async getAllNewsletterEmails(email) {

	const getAllNewsletterEmails = await client.query(
	  q.Paginate(
	    q.Match(
	      q.Ref('indexes/all_newsletter_emails')))
	)
	  .then((response) => {
	    const newsEmails = response.data
	    // create new query out of todo refs. 
	    // https://docs.fauna.com/fauna/current/api/fql/
	    const getAllNewsEmailsDataQuery = newsEmails.map((ref) => {
	      return q.Get(ref)
	    })
	    // query the refs
	   client.query(getAllNewsEmailsDataQuery).then((data) => { 
	   		let allEmails = [];
	   			data.forEach(el => allEmails.push(el.data.email));
	   			if(!allEmails.includes(email)) {
	   				// Call function to send new nwesletter to database
	   				this.createNewNewsletterEmail(email);
	   				this.setState({ newsletterAlreadyMsg: false })
	   			} else {
	   				this.setState({ newsletterAlreadyMsg: true, newsletterConfirmMsg: false })
	   			}
	   	})
	    
	  })
	  .catch((error) => console.log('Error', error.message))
}

async createNewNewsletterEmail(email) {
	// Get today's date and send new email to database
	let today  = new Date(),
		dd     = String(today.getDate()).padStart(2, '0'),
		mm     = String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
		yyyy   = today.getFullYear();
		today  = mm + '/' + dd + '/' + yyyy;

		let createEmail = 
			await client.query(
				  q.Create(
				    q.Collection('newsletter_emails'),
				    { data: { 
				    		  email        : this.state.newsletterInput,
							  subscribedAt : today 
							}},  ))
				.then((ret) => {
					this.setState({ newsletterInput: '', newsletterInputValid: false, newsletterConfirmMsg: true, newsletterErrorCreate: false, newsletterAlreadyMsg: false })
				})
				.catch((err) => {
					console.log(err);
					this.setState({ newsletterErrorCreate: true, newsletterConfirmMsg: false, newsletterAlreadyMsg: false })
				})
}

handleHeightFooterMenu(e) {
	// Expand footer sections on mobile view
	let parentElSection = e.target.offsetParent.nextSibling;

	if(parentElSection.classList.contains('expand_fosect')) {
		parentElSection.classList.remove('expand_fosect');
	} else {
		parentElSection.classList.add('expand_fosect');
	}
}

	render() {
		return (
				<div>
					<div className='row'>
						<div className='footer_container col-12'>
							<div className='row justify-content-center'>
								<div className='footer_cont_wrap_links'>
									<div className='footer_cowrap_links_sect'>
										<span className='footer_cowrap_links_title'>Magazin <i className='fas fa-plus' onClick={(e)=>this.handleHeightFooterMenu(e)}></i></span>
										<ul className='footer_corwap_ul'>
											<li><Link to={'/products/women'}>Femei</Link></li>
											<li><Link to={'/products/men'}>Barbați</Link></li>
											<li><Link to={'/products/children'}>Copii</Link></li>
											<li><Link to={'/'}>TDesign Home</Link></li>
										</ul>
									</div>
									<div className='footer_cowrap_links_sect'>
										<span className='footer_cowrap_links_title'>Informații corporative <i className='fas fa-plus' onClick={(e)=>this.handleHeightFooterMenu(e)}></i></span>

										<ul>
											<li><Link to={'/'}>Cariere TDesign</Link></li>
											<li><Link to={'/contact'}>Despre TDesign</Link></li>
											<li><Link to={'/'}>Relații cu investitorii</Link></li>
											<li><Link to={'/'}>Protecția consumatorilor</Link></li>
										</ul>

									</div>
									<div className='footer_cowrap_links_sect'>
										<span className='footer_cowrap_links_title'>Ajutor <i className='fas fa-plus' onClick={(e)=>this.handleHeightFooterMenu(e)}></i></span>

										<ul>
											<li><Link to={'/'}>Serviciul clienți</Link></li>
											<li><Link to={'/account'}>Contul meu</Link></li>
											<li><Link to={'/contact'}>Localizare magazin</Link></li>
											<li><Link to={'/contact'}>Contact</Link></li>
										</ul>
									</div>
									<div className='footer_cowrap_links_sect footer_cowrap_links_last'>
										<span className='footer_cowrap_links_title_last'>Devino membru</span>
										<ul>
											<li className='footer_cowrlink_regist'><Link to={'/register'}>Creează cont</Link></li>
											<li className='foo_cowrlink_newslettertitle'>Abonează-te pentru promoții</li>
											<li className='foo_cowrlink_nwlt_wrap_input'>
												<input type='text' value={this.state.newsletterInput} placeholder='Email' onChange={(e)=>this.handleNewsletterChange(e)}/>
											</li>
											{this.state.newsletterConfirmMsg      && ( <li className='foo_newslett_msg newl_em_confirm'>Mulțumim pentru abonare!</li> )}
											{this.state.newsletterInvalidEmailMsg && ( <li className='foo_newslett_msg newl_em_err'>Email invalid</li> )}
											{this.state.newsletterAlreadyMsg      && ( <li className='foo_newslett_msg newl_em_err'>Email deja abonat</li> )}
											{this.state.newsletterErrorCreate     && ( <li className='foo_newslett_msg newl_em_err'>Eroare. Reîncercați.</li> )}

											<li className='foo_newslett_btn' tabindex='0' onClick={()=>this.handleNewsletterButton()}>Abonează-te!</li>
										</ul>
									</div>
								</div>
							</div>

						{/* Footer social icons */}
							<div className='row justify-content-center'>
								<div className='footer_social_wrap'>
									<i className='fab fa-facebook'  tabindex='0'></i>
					    			<i className='fab fa-instagram' tabindex='0'></i>
									<i className='fab fa-twitter'   tabindex='0'></i>
									<i className='fab fa-youtube'   tabindex='0'></i>
									<i className='fab fa-pinterest' tabindex='0'></i>
								</div>
							</div>

							{/* Footer logo */}
							<div className='row justify-content-center'>
								<div className='footer_logo'>
									Tshirt
									<span>TD</span>
									Design
								</div>
							</div>

							{/* Footer copyright */}
							<div className='row justify-content-center'>
								<span className='footer_copyrights'>&copy; TshirtDesign</span>
							</div>
						</div>
					</div>
				</div>
		)
	}
}

export default Footer;