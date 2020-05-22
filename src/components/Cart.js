import React from 'react';
import '../css/Cart.css';
import { Link               } from 'react-router-dom';

import logo2 from '../images/pants2.jpg';



class Cart extends React.Component {


	state ={
		cartEmpty: false,
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
		                  	Cosul tau
		                  </span>
		                </div>    
	                </div>

	                <div className='row justify-content-center'> 
						<div className='cart_container col-11'>
							{/* Wishlist title */}
							<div className='row justify-content-center'>
								<span className='cart_title col-11'>
									Coșul tău
									<span className='cart_title_no_items'>(2 produse)</span>
									<span className='cart_title_info'> Nu mai amâna comanda - adăugarea produselor în coș nu înseamnă rezervare.</span>
								</span>
							</div>

							{/* Empty Cart wrap */}
							{this.state.cartEmpty ? (
							<div className='row justify-content-center'>
								<div className='empty_cart_container col-11'>
									{/* Empty cart box message */}
									<div className='row justify-content-center'>
										<div className='empty_cart_msg_box'>
											<span className='cart_title_font'><i className='fas fa-shopping-bag'></i>Coșul tau esti gol</span>
											<span className='cart_subtitle_font'>Vizualizează oferta noastră si vezi ce iti place :)</span>
											<span className='cart_back_btn'>Pagina principală</span>
										</div>
									</div>
									{/* Down info */}
									<div className='row justify-content-center'>
										<div className='empty_cart_info col-10'>
											<span className='cart_title_font_two'>Iti lipsesc produsele din cos ?</span>
											<span className='cart_subtitle_font'>Asigură-te că ești conectat la cont.</span>
											<span className='cart_subtitle_font'>Conectarea va sincroniza coșul de cumpărături cu celelalte device-uri.</span>
											<span className='cart_subtitle_font'>Pentru clienții neconectați, produsele vor rămâne în coș zece zile.</span>
										</div>
									</div>
								</div>
							</div>
							):(
							<React.Fragment>
								<div className='row justify-content-center'>
									<div className='cart_products_wrap col-11'>
										<div className='row justify-content-center'>
											<div className='cart_product_b col-12'>
												<div className='row'>
													{/* Cart product image */}
													<div className='cart_produdct_image col-12 col-md-3 col-lg-2'>
														<img src={logo2} alt=''/>
													</div>
													{/* Cart product info */}
													<div className='cart_product_info col-12 col-md-9 col-lg-8'>
														<span className='cart_prodinfo_title'>Tenisi Vans V2.6 TY-666 Blue White S Size Season 9</span>
														<span className='cart_prodinfo_subdetails'>Id: 2555666, CLS.5</span>
														<div className='row'>
															{/* Cart product info row two */}
															<div className='cart_prod_info_secrow col-12'>
																<div className='cprod_inf_quant'>
																	Cantitate:
																	<select className='form-control cprod_form_quant'>
																		<option>1</option>
																		<option>2</option>
																		<option>3</option>
																		<option>4</option>
																	</select>
																</div>
																<span className='cprod_inf_refresh'><span>Actualizeaza</span></span>
																<span className='cprod_inf_available'><i className='far fa-check-circle'></i> Produs disponsibil</span>
																<span className='cprod_inf_size'>Marime: <span>XL</span></span>
																<span className='cprod_inf_color'>Culoare: <span style={{"backgroundColor":"red"}}  ></span></span>
															</div>
														</div>
													</div>
													{/* Cart product right */}
													<div className='cart_product_right col-12 col-lg-2'>
														<span className='cart_prod_oldprice'>335,00 lei</span>
														<span className='cart_prod_price'>269,00 lei</span>
														<span className='cart_prod_discount ml-auto'>-20%</span>
													</div>	
												</div>
													{/* Cart product actions */}
												<div className='row'>
													<div className='d-xs-none col-sm-block col-md-3 col-lg-2 col_act_one'></div>
													<div className='cart_product_actions col-12 col-md-8'>
														<span className='card_prod_act card_prod_act_wishbtn'><i className='far fa-heart'></i>Adauga la wishlist</span>
														<span className='card_prod_act card_prod_remove'>
														 	<i className='far fa-times-circle'></i>
															Sterge
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='row justify-content-center'>
									<div className='cart_bottom col-11'>
										<div className='row justify-content-center'>
											<div className='cart_bottom_sec col-12 col-md-5'>
												{/* Discount button */}
												<div className='row justify-content-center'>
													<span className='cart_bottom_cpn_title'>Ai un cupon de discount ?</span>
												</div>	
												<div className='row justify-content-center'>
													<div className='cart_bottom_usecpn'>
														<span className='cart_bottom_wrap_usecpn'>
															<input type='text' placeholder='Cod promotional'/>
														</span>
														<div className='row justify-content-center'>
															<span className='cart_bottom_applycpn'>Aplica</span>
														</div>
													</div>
												</div>
												{/* Back to homepage button */}
												<div className='row justify-content-center'>
													<Link to={'/'} className='cart_bottom_backbtn'>
														<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
														  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
														  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
														</svg>
														Inapoi la cumparaturi
													</Link>
												</div>
											</div>
											<div className='cart_bottom_sec order-first col-12 order-md-0 col-md-7'>
												<div className='row justify-content-center'>
													{/* Cart bottom totals */}
													<div className='cart_bottom_totals'>
															<div className='cart_subtotal cart_sbt'>
																<span className='cart_label'>Suma</span>
																<span className='cart_value'>267,99 lei</span>
															</div>
															<div className='cart_deliver cart_sbt'>
																<span className='cart_label'>Livrare gratuita</span>
																<span className='cart_value'>0,00 lei</span>
															</div>
															<div className='cart_total cart_sbt'>
																<span className='cart_label'>Total</span>
																<span className='cart_value'>267,99 lei</span>
															</div>
															<div className='cart_savings cart_sbt'>
																<span className='cart_label'>Economisesti</span>
																<span className='cart_value'>67,00 lei</span>
															</div>
															<span className='cart_totals_proceed_btn'>Mergi la casa</span>
															<span className='cart_totals_underbtn_note'>* 30 de zile pentru returnare gratuită</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Bottom info note */}
								<div className='row justify-content-center'>
									<div className='cart_bottom_info col-10'>
										<span className='cart_bottom_info_title'>Probleme in procesarea produselor?</span>
										<span className='cart_bottom_info_subtitle'>Trimite-ne un email la 
											<a href='mailto:contact@thsirtdesign.ro'> contact@thsirtdesign.ro </a>
											si iti vom raspunde in maxim 24h.
										</span>
									</div>
								</div>
							</React.Fragment>
							)}
						</div>
					</div>


				</div>
			)
	}
}

export default Cart;