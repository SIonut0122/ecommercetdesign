import   React  from 'react';
import   path   from 'path';
import { Link } from 'react-router-dom'
import '../../css/Account.css';


const AccountMenu = (props) => {
	return (
			<div>
			
				 <div className='row'>
					<div className='acc_sec_menu'>
						<span className='acc_menu_selected_title'>{props.name}</span>
					
						<Link to='/account' className='account_menu_btn'>
							Profilul meu 
							{props.location === 'myprofile' && (
							<i className='fas fa-angle-right'></i>
							)}
						</Link>
						<Link to='/account/myorders' className='account_menu_btn'>
							Comenzile mele
							{props.location === 'myorders' && (
							<i className='fas fa-angle-right'></i>
							)}
						</Link>
						<Link to='/account/shippingdata' className='account_menu_btn acc_menbtn_last'>
							Date de livrare
							{props.location === 'shippingdata' && (
							<i className='fas fa-angle-right'></i>
							)}
						</Link>

						{/* Down menu info */}
						<div className='acc_menu_info'>
							<span className='acc_menu_info_title'>Contact <span>Serviciul clienți</span></span>
							<i className='fas fa-mobile-alt'></i>
							<span className='acc_menu_info_schd'>Lu-Vi 09:00-18:00</span>
							<span className='acc_menu_info_phone'>0727 464 5671</span>
						</div>
						
					</div>
				</div>
			</div>
		)

}

export default AccountMenu;