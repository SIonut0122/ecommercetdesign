import   React            from 'react';
import   getAllOrdersDb   from './getAllOrdersDb';
import { client, q      } from '../../fauna/db';
import { connect        } from "react-redux";
import { Link, Redirect } from 'react-router-dom'
import '../../css/Dashboard.css';


const mapStateToProps = state => {
  return {  
  		  userIsSignedIn   : state.userIsSignedIn,
  		  userDbInfo       : state.userDbInfo,
  		  userInfo         : state.userInfo        
        };
};


class connectedactiveOrders extends React.Component {

	state = {

		selectedNav    : 'Comenzi active',
		allOrdersDb    : null,
		allOrdersState : null,

		 
	}

componentDidMount() {
	// Hide header
   	document.querySelector('.header_container').setAttribute('style','display:none !important;');
    document.querySelector('.main_container').setAttribute('style','margin-top:0 !important;');
    // Fetch all orders data
    this.getAllOrders();
}

async getAllOrders() {
	let get = await getAllOrdersDb
	.then((res) => {
		this.setState({ allOrdersDb: res, allOrdersState: res.filter(el => el.data.status.includes('In tranzit'))})
	})
	.catch((err) => {
		console.log(err);
	})
}

 componentWillUnmount() {
 	// Display header and remove margin top from main container
   	document.querySelector('.header_container').removeAttribute('style');
    document.querySelector('.main_container').removeAttribute('style');
 }

searchByTransactionId(e) {
	let value = e.target.value;
	// Return product where transaction id / email / phone  includes value
	if(value.length > 0) {
		this.setState({ allOrdersState: this.state.allOrdersDb.filter(el => {
			if(el.data.transactionId.includes(value) || el.data.email.includes(value) || el.data.phone.includes(value)) {
				return el;
			}	
		})});
	} else {
		this.setState({ allOrdersState: this.state.allOrdersDb })
	}
}

displayActiveOrders() {
	// Get only products where 'status' includes 'in tranzit'
	this.setState({ 
			selectedNav: 'Comenzi active',
			allOrdersState: this.state.allOrdersDb.filter(el =>  el.data.status.includes('In tranzit'))
		})
}
displayInactiveOrders() {
	// Get only products where 'status' includes 'Anulata' or 'Finalizata'
	this.setState({ 
			selectedNav: 'Comenzi finalizate',
			allOrdersState: this.state.allOrdersDb.filter(el =>  {
					if(el.data.status.includes('Anulata') || el.data.status.includes('Finalizata')) {
						return el;
					} 
				})})
}

async handleActionBtnOrder(order,actionType) {
	let actType = actionType;
	// Use order reference id to update status with 'actionType' received from clicked order
	// Get active order data / Target active_orders collecton to modify order status using the order.ref.value.id as a refference
 	let changeOrderStatus = await client.query(
	  q.Update(
	    q.Ref(q.Collection('active_orders'), order.ref.value.id),
	    { data: { status: actType } }, // Modify order status with the received parameter value 'In tranzit, Anulata, Finalizata'
	  )
	)
	.then((res) => { 
			// Send order data to get id of the user to modify user's 'my orders' prop from DB
		 	this.modifyUserOrdersStatus(res, actType);
			console.log('Articolul a fost actualizat. Reimprospatare in 2 secunde');
		 })
	.catch((err) => console.log('Articolul nu a fost actualizat' + err))
}

async modifyUserOrdersStatus(updatedOrderedStatus, actionType) {
	let actType = actionType; // Use this actiontype to update status from user's my orders
	let userDbRefId = updatedOrderedStatus.data.userDbAccountRefId;

	let getUserDbInfo = await client.query(
	  q.Get(q.Ref(q.Collection('users'), userDbRefId))
	)
	.then((userDbInfo) => {
		let userOrders = [...userDbInfo.data.myorders]; // Create new my orders array to be modified

		for(let c in userOrders) {
			// If transaction/name/product id are equal with clicked active order, modify order from my user with received action type
			if( userOrders[c].transactionId === updatedOrderedStatus.data.transactionId &&
			    userOrders[c].name === updatedOrderedStatus.data.name &&
			    userOrders[c].productId === updatedOrderedStatus.data.productId ) {
			    userOrders[c].status = actType;
				// Update user myorders
				client.query(
				  q.Update(
				    q.Ref(q.Collection('users'), userDbRefId),
				    { data: { myorders: userOrders } }, // Modify order status with the received parameter value 'In tranzit, Anulata, Finalizata'
				  )
				)
				.then(() => {
					console.log('Articolul a fost actualizat. Reimprospatare in 2 secunde');
						window.location.reload();
				})
				.catch((err) => console.log('ERROR'))
			}
		}
	})
	.catch((err) => console.log('Error while trying to modify user order status', err))

}



	render() {

		// If user is not signed in and userDbInfo != null, display loading 
		if(this.props.userIsSignedIn === null && this.props.userDbInfo === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		}  else if(this.props.userIsSignedIn && this.props.userDbInfo === null) {
			return (<div className='account_loading_modal'>
						<div className='row justify-content-center h-100'>
							<div className='acc_load_mod my-auto'><div></div><div></div><div></div><div></div></div>
						</div>
					</div>)
		}


  		// If access_granted === undefined || !== 'mod' , redirect to mainpage
		if(this.props.userDbInfo.data.access_granted === undefined || this.props.userDbInfo.data.access_granted !== 'mod') {
			return ( <Redirect to={'/'}/> )
		}


		return (
			<div>
				<div className='row'>
					 <div className='dashboard_activeorders_container col-12'>
					 	<div className='row'>
							<span className='dash_add_prod_title'>
								<Link to={'/dashboard'} className='dash_actorder_backbtn'><i className="fas fa-long-arrow-alt-left"></i> Inapoi</Link>
								<span>{this.state.selectedNav}</span>
							</span>
						</div>

						<div className='row justify-content-center'>
							<div className='dash_activeorders_wrap_menu'>
								<span onClick={()=>this.displayActiveOrders()}>Comenzi active</span>
								<span onClick={()=>this.displayInactiveOrders()}>Comenzi finalizate</span>
							</div>
						</div>

						{/* SEARCH BY ID INPUT */}
						<div className='row justify-content-center mt-3'>
							<div className='dash_search_byid_wrap'>
								<span className='dash_txt'>Cauta articol</span>

								<span className='dash_searchbyid_input_wrap'>
									<input type='text' 
										   placeholder='ID tranzactie, email, telefon'
										   onChange={(e) => this.searchByTransactionId(e)}/>
								</span>
							</div>
						</div>

						<div className='row justify-content-center mt-3'>
							
							{this.state.allOrdersState === null ? (
								<span className='dash_actor_res_msg'>Incarcare...</span>
							) : (
							<React.Fragment>
								{this.state.allOrdersState.length > 0 ? (
								<div className='dash_activeorders_wraporders'>
									{this.state.allOrdersState.map((order,ind) =>
									<div key={ind} className='dash_actord_order_box'>

										{/* ORDERS ACTIONS BUTTON */}
										<div className='dash_actord_orderactions_btn'>
										{this.state.selectedNav === 'Comenzi active' ? (
											<React.Fragment>
											<span className='dash_actorder_finishedorder_btn' onClick={()=>this.handleActionBtnOrder(order,'Finalizata')}>Comanda finalizata</span>
											<span className='dash_actorder_canceledorder_btn' onClick={()=>this.handleActionBtnOrder(order,'Anulata')}>Comanda anulata</span>
											<span className='dash_actord_order_txt dactord_ord_txt_refid'>refId: {order.ref.value.id}</span>
											</React.Fragment>
										): (
											<span className='dash_actorder_inprocessorder_btn' onClick={()=>this.handleActionBtnOrder(order,'In tranzit')}>In tranzit</span>
										)}
										</div>
										<div className='dash_actord_sec_one'>
											<span className='dash_actord_order_txt'><strong>{ind+1})</strong> Status comanda: <span style={{color: order.data.status === 'In tranzit' ? 'orange' : order.data.status === 'Anulata' ? '#FF3E3E' : 'green'}}>{order.data.status}</span></span>
											<span className='dash_actord_order_txt'>ID tranzactie: <span>{order.data.transactionId}</span></span>
											<span className='dash_actord_order_txt'>Data comanda: <span>{order.data.completedOrderDate}, ora: {order.data.completedOrderHour}</span></span>
											<span className='dash_actord_order_txt'>Curier: <span>{order.data.courierType}</span></span>
											<span className='dash_actord_order_txt'>Email client: <span>{order.data.email}</span></span>
											<span className='dash_actorder_img_title'>
												<img src={order.data.img}/>
												<span>{order.data.name}</span>
											</span>
										</div>
										<div className='dash_actord_sec_two'>
											<span className='dash_actord_order_txt'>ID articol: <span>{order.data.productId}</span></span>
											<span className='dash_actord_order_txt'>Cantitate: <span>{order.data.quantity}</span></span>
											<span className='dash_actord_order_txt'>De plata: <span>{order.data.totalAmount} lei</span></span>
											<span className='dash_actord_order_txt'>Adresa de livrare: <span>{order.data.shippingAddress}</span></span>
											<span className='dash_actord_order_txt'>Telefon client: <span>{order.data.phone}</span></span>
											<span className='dash_actord_order_txt'>Alte informatii: <span>{order.data.additionalInfo}</span></span>
										</div>
									</div>
									)}
								</div>
								): (
									<span className='dash_actor_res_msg'>Nu s-a gasit nicio comanda</span>
								)}
							</React.Fragment>
							)}
						</div>

					 </div>
				</div>
			</div>
		)
	}
}

const activeOrders = connect(mapStateToProps,null)(connectedactiveOrders);
export default activeOrders;