import   React                 from 'react';
import   AccountMenu           from './AccountMenu';
import { Link,Redirect }       from 'react-router-dom'
import { connect }             from "react-redux";
import '../../css/Account.css';



const mapStateToProps = state => {
  return {  
  		  userIsSignedIn : state.userIsSignedIn,
  		  userDbInfo     : state.userDbInfo 
        };
};

class connectedMyOrders extends React.Component {

	state = {
			componentIsLoading : true,
			ordersEmpty        : false,
	}


componentDidMount() {
	// Display loading effect for 1 sec	
	setTimeout(() => { this.setState({ componentIsLoading: false })},1000)
	// Scoll to top on every mount
	window.scrollTo(0, 0);
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

		// Set document title if user is logged in
		document.title = 'Comenzile mele - Tshirt Design';


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
												{this.props.userDbInfo.data.myorders === undefined || !this.props.userDbInfo.data.myorders.length > 0 ? (
												<div className='acc_myorders_empty col-12'>
													<span className='acc_myorders_empty_title'>Nu ai plasat nicio comandă</span>
													<Link to={'/'}>Continuați cumpărăturile</Link>
												</div>
												) : (
												<div className='acc_myorders_wrap col-12'>
													{this.props.userDbInfo.data.myorders.map((order,ind) =>
														<div key={ind} className='acc_ordered_prod'>
															<Link to={`/productinfo/${order.productId}`}><img src={order.img} alt=''/></Link>
															<span className='acc_ordered_prod_info'>
															<span className='acc_ord_prodinfo_delivered acc_o_pd_status'>Status:<span style={{color: order.status === 'In tranzit' ? 'orange' : order.status === 'Anulata' ? '#FF3E3E' : 'green'}}> {order.status}</span></span>
																<Link to={`/productinfo/${order.productId}`} className='acc_ord_prodinfo_title'>{order.name}</Link> 
																<span className='acc_ord_prodinfo_delivered'>Comandat pe: <span>{order.completedOrderDate}, ora: {order.completedOrderHour}</span></span>
																<span className='acc_ord_prodinfo_delivered'>Id produs: <span>{order.productId}</span></span>
																<span className='acc_ord_prodinfo_delivered'>Id tranzacție: <span>{order.transactionId}</span></span>
																<span className='acc_ord_prodinfo_price'>{order.totalAmount} lei <span>( {order.quantity} articole )</span></span>
															</span>
														</div>
														)}
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