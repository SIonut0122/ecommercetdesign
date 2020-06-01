import React from 'react';
import '../css/Header.css';
import { connect }            from "react-redux";
import { Link               } from 'react-router-dom'
import { setSearchInput,setOpenMobileSearch, setOpenMediumSearch,setSelectedProducts } from '../actions';
import { Router   } from 'react-router-dom'; 

import   menProducts from '../data/men';
import   womanProducts from '../data/womans';



const mapStateToProps = state => {
  return {  
  		  selectedProducts : state.selectedProducts,
          searchInput      : state.searchInput,
          openMobileSearch : state.openMobileSearch,
          openMediumSearch : state.openMediumSearch
        };
};


function mapDispatchToProps(dispatch) {
  return {
  		  setSelectedProducts : products    => dispatch(setSelectedProducts(products)),
          setSearchInput      : inputValue  => dispatch(setSearchInput(inputValue)),
          setOpenMobileSearch : bol         => dispatch(setOpenMobileSearch(bol)),
          setOpenMediumSearch : bol         => dispatch(setOpenMediumSearch(bol)),
        };
}


class connectedHeader extends React.Component {

	state = {
		openSortByMenu   : false,
		openMobileMenu   : false
	}


componentDidMount() {
	window.addEventListener('resize', (e) =>this.handleHeaderResize(e));
}

componentWillUnmount() {
	window.removeEventListener('resize', (e) =>this.handleHeaderResize(e));
}

handleHeaderResize(e) {
	 
	if(window.innerWidth > 575.5) {
		// Hide mobile search 
		if(this.props.openMobileSearch) {
			this.props.setOpenMobileSearch({ openMobileSearch: false })
		}
		// Close mobile menu if displayed
		if(this.state.openMobileMenu) {
			this.setState({ openMobileMenu: false })
		}
	}
	// If medium search input is displayed of this breakpoints, close it
	if(window.innerWidth <= 576 || window.innerWidth >= 992) {
		if(this.props.openMediumSearch) {
			this.props.setOpenMediumSearch({ openMediumSearch: false })
		}
	}

}

/* Mobile search handler */
openMobileSearch() {
	// Close or render search dropdown with transition
	if(this.props.openMobileSearch) {
		this.props.setOpenMobileSearch({ openMobileSearch: false })		
	} else {
		this.props.setOpenMobileSearch({ openMobileSearch: true })
		// Give time to render
		setTimeout(() => {
			document.querySelector('.search_mobile_dropdown').setAttribute('style','height:100% !important');
		},200);

		// Close mobile menu if displayed
		if(this.state.openMobileMenu) {
			document.querySelector('.head_mob_menu').classList.remove('mobmenu_active');
			setTimeout(() => {
			this.setState({ openMobileMenu: false })
			},300)
		}
	}
}

/* Medium search Handler */
openMedSizeSearch() {
	// Close / display medium search input
	if(this.props.openMediumSearch) {
		this.props.setOpenMediumSearch({ openMediumSearch: false })
	} else {
		this.props.setOpenMediumSearch({ openMediumSearch: true })
		setTimeout(() => {
			document.querySelector('.nav_search_medium_input').setAttribute('style','width:100% !important');
		},200);
	}
}	

 

handleMobileMenu() {

	if(!this.state.openMobileMenu) {
		this.setState({ openMobileMenu: true })
		setTimeout(() => {
			document.querySelector('.head_mob_menu').classList.add('mobmenu_active');
		},300)
	} else {
		document.querySelector('.head_mob_menu').classList.remove('mobmenu_active');
		setTimeout(() => {
		this.setState({ openMobileMenu: false })
		},300)
	}


}


	render() {
		return (
			<div>
				<div className='row justify-content-center'>
					<div className='header_container col-12'>

						{/* Search mobile dropdown container */}
						{this.props.openMobileSearch && (
						<div className='search_mobile_dropdown col-12' onClick={() => {this.props.setOpenMobileSearch({ openMobileSearch: false })}}>
							<span className='smdrop_close'>&times;</span>
						 	<div className='row'>
								<div className='smdrop_wrap_input col-12' onClick={(e) => {e.stopPropagation()}}>
								<span className='smdrop_title'>Caută</span>
									<div className='row justify-content-center'>
										<input type='text'
											   onChange={(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									   	       value={this.props.searchInput}>
										</input>
									</div>
									{/* Mobile search dropdown buttons */}
									<div className='row justify-content-center'>
										<div className='smdrop_buttons col-12'>
											{this.props.searchInput.length > 0 && (
											<span className='smdrop_butt mr-4' 
												  onClick={() => {this.props.setOpenMobileSearch({ openMobileSearch: false })}}>
												  Vezi rezultate ({this.props.selectedProducts !== null ? this.props.selectedProducts.length : '0'})
											</span>
											)}
											<span className='smdrop_butt' 
												  onClick={() => {this.props.setOpenMobileSearch({ openMobileSearch: false });this.props.setSearchInput({ searchInput: ''})}}>
												  Anulează
											</span>
										</div>
									</div>
								</div>
							 </div>
						</div>
						)}
					    {/* Header social media col */}
					    <div className='row'>
					    	<div className='header_social_col col-12'>
					    		<i className='fab fa-facebook'></i>
					    		<i className='fab fa-instagram'></i>
					    		<i className='fas fa-phone'></i>
					    		<span className='h_social_phone'>0727 464 5671</span>
					    		<i className='fab fa-whatsapp'></i>
					    		<span className='h_social_whatapp'>0734 124 6404</span>
					    	</div>
					    </div>
					    <hr className='head_hr'/>
						{/* Header sec one */}
						<div className='row'>
							<div className='col-12 head_sect_one'>
								<div className='row justify-content-center'>
									<div className='hsc_col_logo col-12 col-sm-3 col-lg-2 col-xl-2 hsc_one_col'>
										<div className='row'>
											<span className='hsc_col_logo_hambmenu' onClick={() => this.handleMobileMenu()}><i className='fas fa-bars'></i></span>
											<span className='hsc_col_logo_img'>
												T-SHIRT
											</span>
											<i className='d-block d-sm-none fas fa-search hsc_col_search_mobile' onClick={() => this.openMobileSearch()}></i>
										</div>
									</div>
									<div className='hsc_col_acc col-12 col-sm-9 col-lg-10 col-xl-10 hsc_one_col'>
										<div className='row float-right'>
											<div className='hsccol_acc_cont'>
												<div className='row float-right'>
												
													<Link to={'/login'}>
														<span className='hsccol_user_icon hsccol_acc_icon'>
															<i className='fas fa-user'></i>
														</span>
													</Link>
													<Link to={'/wishlist'}>
														<span className='hsscol_fav_icon hsccol_acc_icon'>
															<span className='hsscol_fav_icon_no'>0</span>
															<i className='fas fa-heart'></i>
														</span>
													</Link>
													<Link to={'/cart'}>
													<span className='hsscol_cart_icon hsccol_acc_icon'>
														<span className='hsscol_cart_icon_no'>15</span>
														<i className='fas fa-shopping-bag'></i>
													</span>
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Header sec one */}
						<div className='row'>
							<div className='head_nav_menu col-12'>
								<div className='row justify-content-sm-start justify-content-md-center'>
									<Link to={'/products/men'}    className='nav_menu_link'>Barbati</Link>
									<Link to={'/products/womans'} className='nav_menu_link'>Femei</Link>
									<span className='nav_menu_link'>Noutati</span>
									<span className='nav_menu_link'>Custom</span>
									<span className='nav_menu_link'>Contact</span>

									{/* Search bar on large breakpoint */}
									<form className='nav_m_search form-inline d-flex justify-content-center md-form form-sm active-cyan active-cyan-2 mt-2'>
									  <i className='fas fa-search' aria-hidden='true'></i>
									  <input className='form-control form-control-sm ml-3 w-75' 
									  		 type='text' 
									  		 placeholder='Search'
									    	 aria-label='Search' 
									    	 onChange={(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									    	 value={this.props.searchInput}>
									   </input>
									</form>

									{/* Search bar on medium breakpoint */}
									<i className='fas fa-search nav_m_search_med d-lg-none' onClick={() => this.openMedSizeSearch()}></i>
									{this.props.openMediumSearch && (
									<div className='nav_search_medium_input'>
										<form className='form-inline d-flex justify-content-center md-form form-sm mt-2'>
									  		<input className='form-control form-control-sm w-80' 
									  			   type='text' 
									  			   placeholder='Search'
									   	           aria-label='Search' 
									   	           onChange={(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									   	           value={this.props.searchInput}>
									   	    </input>
										</form>
									</div>
									)}
								</div>
							</div>
						</div>	
						{/* Mobile drop menu*/}
						{this.state.openMobileMenu && (
						<div className='row'>
							<div className='head_mob_menu col-12'>
								<Link to={'/products/men'}       className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Barbati</Link>
								<Link to={'/products/womans'}    className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Femei</Link>
								<Link to={'/products/childrens'} className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Copii</Link>
								<Link to={'/products/customize'} className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Customize</Link>
								<Link to={'/products/contact'}   className='h_mob_menu_btn' style={{borderBottom:'1px solid transparent'}} onClick={()=>this.handleMobileMenu()}>Contact</Link>
							</div>
						</div>
						)}

					</div> {/* End of Header container */}
				</div>  {/* End of Header container row */}
			</div>
		)
	}
}

const Header = connect(mapStateToProps,mapDispatchToProps)(connectedHeader);
export default Header;