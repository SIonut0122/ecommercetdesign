import   React           from 'react';
import   GoogleMapReact  from 'google-map-react';
import { Link }          from 'react-router-dom'
import '../css/Contact.css';

class Contact extends React.Component {

	state = {
			     center : {lat: 44.421143, lng: 26.093942},
                 zoom   : 9,
	}


	componentDidMount() {
		// Highlight this nav title menu
		document.querySelector('.nav_menu_contact').setAttribute('style','background-color:#fff;color:#000;');	 	 
	 	// Scoll to top on every mount
		window.scrollTo(0, 0);

		document.title = 'Contact | TDesign'
	}
	
	componentWillUnmount() {
		document.querySelector('.nav_menu_contact').removeAttribute('style');
	}



	render() {
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
		                  	Contact
		                  </span>
		                </div>    
	                </div>

					<div className='row justify-content-center'> 
						<div className='contact_container col-11'>
							
							<div className='row justify-content-center'>
								<span className='contact_sp_banner'><h2>Contact</h2></span>
							</div>

							<div className='row justify-content-center'>
								<div className='contact_wrap'>
									<span className='contact_stitle'>Cum puteți lua legătura cu Tdesign?</span>

									<ul>
										<li>Echipa TDesign pune accent deosebit pe suportul oferit clienților săi de la prima vizită în site până la finalizarea comenzii.</li>
									
										<li className='mt-5'>Email vanzări: <strong><a href='mailto:contact@tdesign.ro'>contact@tdesign.ro</a></strong></li>
										<li>Email marketing: <strong><a href='mailto:marketing@tdesign.ro'>marketing@tdesign.ro</a></strong></li>
										<li>Email general: <strong><a href='mailto:office@tdesign.ro'>office@tdesign.ro</a></strong></li>
										<li>Telefon general: <strong>0727 464 5671</strong></li>

										<li className='mt-4'>
										Ne pare rău dacă nu ai reușit să iei legătura cu noi telefonic.
										Te rugăm să ne lași un mesaj cu numărul tău de telefon pe adresa de <a href='mailto:contact@tshirtdesign.ro'>contact@tdesign.ro </a> și te sunăm noi în cel mai scurt timp! 
										</li>
									</ul>
									
									<span className='contact_stitle'>Program de lucru cu clienții</span>
									<ul>
										<li>Luni - Vineri <strong>09:00 - 18:00</strong></li>
										<li>Adresă sediu: <strong>Strada Gramont, Nr. 32, Etaj 1, Sector 4, București.</strong></li>
									</ul>


									<span className='contact_stitle'>Localizare sediu</span>
									<ul>
										<li className='contact_wrap_storelocator'> 
											<li className='cont_wrapstoreloc_sec col-12 col-md-6'> 
				                              <GoogleMapReact
				                                  bootstrapURLKeys = {{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
				                                  defaultCenter    = {this.state.center}
				                                  defaultZoom      = {this.state.zoom}>
				                              </GoogleMapReact>
											</li>
											<li className='cont_wrapstoreloc_sec cont_wrapstoreloc_sec_info col-12 col-md-6'>
												<li>Sediu</li>
												<li className='mt-2'>Adresă: Strada Gramont, Nr. 32, Etaj 1, Sector 4, București.</li>
												<li>Program L-V : 09:00 - 20:00</li>
												<li>Program S : 10:00 - 14:00</li>
												<li>Telefon: 0727 464 5671</li>
											</li>
										</li>

										<li className='contact_social_title'>Vrei să fim prieteni?</li>
										<li className='contact_wrap_social'>
												<i className='fab fa-facebook'></i>
								    			<i className='fab fa-instagram'></i>
												<i className='fab fa-twitter'></i>
												<i className='fab fa-youtube'></i>
												<i className='fab fa-pinterest'></i>
										</li>
									</ul>
									
								</div>
							</div>


						</div>
					</div>
				</div>
		)
	}
}

export default Contact;