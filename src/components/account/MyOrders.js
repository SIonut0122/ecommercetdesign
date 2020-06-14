import React from 'react';
import '../../css/Account.css';
import { Link,Redirect               } from 'react-router-dom'
import AccountMenu from './AccountMenu';
import logo2 from '../../images/pants2.jpg';
import { connect }            from "react-redux";





const mapStateToProps = state => {
  return {  
  		  userIsSignedIn   : state.userIsSignedIn
        };
};

class connectedMyOrders extends React.Component {

	state = {
			componentIsLoading: true,
			ordersEmpty: false,
	}


componentDidMount() {
	document.title = 'Comenzile mele - Tshirt Design';
	setTimeout(() => { this.setState({ componentIsLoading: false })},1000)
}

	render() {
		
		// If user is not signed in, redirect to login page
		if(this.props.userIsSignedIn === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		} else if(!this.props.userIsSignedIn) {
			return ( <Redirect to={'/login'}/>)
		}

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
										<AccountMenu location='myorders' name='Comenzile mele'/>
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
									<div className='row justify-content-center'>
										<div className='acc_myorders_container col-12'>
											<div className='row'>
												{this.state.ordersEmpty ? (
												<div className='acc_myorders_empty col-12'>
													<span className='acc_myorders_empty_title'>Nu ai plasat nici o comandă</span>
													<Link to={'/'}>Continuati cumparaturile</Link>
												</div>
												) : (
												<div className='acc_myorders_wrap col-12'>
													<div className='acc_ordered_prod'>
														<img src={logo2} alt=''/>
														<span className='acc_ordered_prod_info'>
															<span className='acc_ord_prodinfo_title'>TShirt Pants V2.5 Blue Color Blue ColorBlue Color</span> 
															<span className='acc_ord_prodinfo_delivered'>Comandat pe: 25.05.2020</span>
															<span className='acc_ord_prodinfo_price'>29.99 ron <span>( x1 )</span></span>
														</span>
													</div>
												</div>
												)}
											</div>
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


const MyOrders = connect(mapStateToProps,null)(connectedMyOrders);
export default MyOrders;