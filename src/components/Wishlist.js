import React from 'react';
import '../css/Wishlist.css';
import { Link               } from 'react-router-dom';

import logo2 from '../images/pants2.jpg';

class Wishlist extends React.Component {


	state ={
		wishlistEmpty: true,
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
		                  	Wishlist
		                  </span>
		                </div>    
	                </div>

	                <div className='row justify-content-center'> 
						<div className='wishlist_container col-11'>
							{/* Wishlist title */}
							<div className='row justify-content-center'>
								<span className='wishlist_title col-11'>
									Wishlist
									<span className='wishlist_title_no_items'>- 2 produse</span>
								</span>
							</div>
							{/* Items container */}
							{!this.state.wishlistEmpty ? (
							<div className='row justify-content-center'>
								<div className='wishlist_wrap col-11'>
									<div className='row justify-content-center'>
										<div className='wish_product_box'> 
											<i className='fa fa-heart wish_remove_prod'></i>
											<div className='row justify-content-center'>
											<img src={logo2} alt=''/>
											</div>
											<div className='row justify-content-center'>
												<span className='wishprod_title'>Polo YT-5 Cotton Blue Size And Fellows</span>
											</div>
											<div className='row justify-content-center'>
												<span className='wishprod_price'>59.99 lei
													<span className='wishprod_old_price'>79.99 lei</span>
												</span>
											</div>
										</div>
										<div className='wish_product_box'>
											<i className='fa fa-heart wish_remove_prod'></i>
											<div className='row justify-content-center'>
												<img src={logo2} alt=''/>
											</div>
											<div className='row justify-content-center'>
												<span className='wishprod_title'>Polo YT-5 Cotton Blue Size And Fellows</span>
											</div>
											<div className='row justify-content-center'>
												<span className='wishprod_price'>49.99 lei
													<span className='wishprod_old_price'>59.99 lei</span>
												</span>
											</div>
										</div>

									</div>
								</div>
							</div>
							):(
							<div className='row justify-content-center'>
								<div className='wishlit_empty_cont col-11'>
									<div className='row justify-content-center'>
										<div className='wishlist_empty_sec col-12 col-md-12 col-lg-6'>
											<div className='row justify-content-center'>
												<div className='wishlist_secone_wrap'>
													<span className='wishlist_subtitle_font'>Wishlist-ul tău este gol</span>
													<span className='wshl_subpoint'>Alege-ți produsele preferate apăsând pe <i className='far fa-heart'></i></span>
													<span className='wishlist_subtitle_font'>Cum se folosește wishlist-ul?</span>
													<span className='wshl_subpoint'>- Adăugarea unui produs la wishlist nu îl rezervă</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului este salvat automat</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului pentru clienții neînregistrați este păstrat pentru o lună de zile</span>
													<span className='wshl_subpoint'>- Conținutul wishlist-ului pentru clienții înregistrați este păstrat până când aceștia îl vor șterge manual</span>
												</div>
											</div>
										</div>
										<div className='wishlist_empty_sec col-12 col-md-12 col-lg-6'>
											<div className='row justify-content-center'>
												<div className='wishlist_sectwo_wrap col-12'>
													{/* Login button */ }
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font'>Ai deja cont ?</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Conectează-te pentru a sincroniza conținutul coșului între device-uri</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wishlist_login_button'>Conecteaza-te</span>
													</div>
													{/* Register button */}
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font mt-4'>Cont nou</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Inregistreaza-te pentru a beneficia de multe oferte</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wishlist_login_button wsh_register_btn'>Inregistreaza-te</span>
													</div>
													{/* Google plus button */ }
													<div className='row justify-content-center'>
														<span className='wishlist_subtitle_font mt-4'>SAU</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wshl_subpoint_sectwo'>Conecteaza-te rapid cu</span>
													</div>
													<div className='row justify-content-center'>
														<span className='wishlist_google_plus_button'><i className='fab fa-google-plus-g'></i>Google+</span>
													</div>
												</div>
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

export default Wishlist;