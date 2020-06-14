import React from 'react';
import '../css/Header.css';
import { connect }            from "react-redux";
import { Link, Redirect               } from 'react-router-dom'
import { setSearchInput,setOpenMobileSearch, 
		 setOpenMediumSearch,setSelectedProducts,
		 setUserIsSignedIn,setUserInfo,
		 setWishList, setCart,setSignedWithGoogle,
		 setUserDbInfo } from '../actions';

import menProductsData from '../data/men';
import womenProductsData from '../data/women';
 


const mapStateToProps = state => {
  return {  
  		  userIsSignedIn   : state.userIsSignedIn,
  		  userInfo         : state.userInfo,
  		  wishList         : state.wishList,
  		  cart             : state.cart,
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
          setWishList         : wishlist    => dispatch(setWishList(wishlist)),
          setCart             : cart        => dispatch(setCart(cart)),
          setUserIsSignedIn   : bol         => dispatch(setUserIsSignedIn(bol)),
          setUserInfo   	  : user        => dispatch(setUserInfo(user)),
          setSignedWithGoogle : bol         => dispatch(setSignedWithGoogle(bol)),
          setUserDbInfo       : userDB      => dispatch(setUserDbInfo(userDB))
        };
}


class connectedHeader extends React.Component {

	constructor(props) {
		super(props);
	 
	this.state = {
		userIsSignedIn   : null,
		displayUserDropdownMenu: false,
		hoveringAccountIcon: false,
		hoveringDropdownMenu: false,
		wishList         : this.props.wishList,
		openSortByMenu   : false,
		openMobileMenu   : false
	}
}

componentDidMount() {
	window.addEventListener('resize', (e) =>this.handleHeaderResize(e));

	/*// Check when pageloads in localStorage for stored wishlist and set it as props
    if (window.localStorage.getItem('wishList') !== null) {
          let wishList = JSON.parse(localStorage.getItem('wishList'));
          this.props.setWishList({ wishList })
    }
    // Check when pageloads in localStorage for stored cart and set it as props
     if (window.localStorage.getItem('cart') !== null && !this.props.cart.length > 0 ) {
	 	 let cartStorage = JSON.parse(localStorage.getItem('cart'));
	 	  this.props.setCart({ cart: cartStorage })
	 } */
	

	 this.authListener();
 
}


 
authListener() {
 
			// if user is logged in, set state user to user and use the data
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        	this.props.setUserInfo({ userInfo: user })
        	this.props.setUserIsSignedIn({ userIsSignedIn: true })
            this.props.setSignedWithGoogle({ signedWithGoogle: user.emailVerified})
 			console.log('User is  signed in');
 

	     } else {	
	    	console.log('User is not signed in');
	    	this.props.setUserIsSignedIn({ userIsSignedIn: false })
	    	this.props.setUserInfo({ userInfo: null })
	    }
    });
}


authSignOut() {
	// Signout and reload
	firebase.auth().signOut().then(() => {
	 window.location.reload();
	}).catch(function(error) {
	  console.log('An error occurred while signing out');
	});
}


componentWillUnmount() {
	// Use this to restyle page depending of page size
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
	// Hide / display mobile menu
	// First render div, then apply style with transition
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

/*___ Account dropdown menu  ___*/


accountIconHoverIn() {
	// Display account dropmenu / Hovering icon to true
	this.setState({ displayUserDropdownMenu: true, hoveringAccountIcon: true })
	// Avoid not displaying the dropmenu while hovering account icon
	if(!this.state.displayUserDropdownMenu && this.state.hoveringAccountIcon && !this.state.hoveringDropdownMenu) {
		this.setState({ displayUserDropdownMenu: true })
	}
}
accountIconHoverOut() {
	// When hovering out the icon, leave time to setstate if user is not hovering over the dropmenu and close it
	setTimeout(() => { if(!this.state.hoveringDropdownMenu) { this.setState({ displayUserDropdownMenu: false }) } },500);
	// Set to false hovering icon
	this.setState({ hoveringAccountIcon: false})
}

dropDownMenuHoverOut() {
	// When hovering out the dropmenu, check if user is not hovering the account icon and close it if not
	if(!this.state.hoveringAccountIcon) { this.setState({ displayUserDropdownMenu: false }) }
	// Set to false hovering dropmenu
	this.setState({ hoveringDropdownMenu: false })
}

handleAccDropdownClick() {
	this.setState({ displayUserDropdownMenu:false, hoveringAccountIcon: false, hoveringDropdownMenu: false})
}

handleSetSearchInputKey(e) {
 	if(e.keyCode === 13 || e.key === 'Enter') {
 		if(this.props.searchInput.length > 0) {
 			document.querySelector('.nav_m_search_btn').click();
 		}
 	}
}

req() {
	const newUser = firebase.functions().httpsCallable('addUser');
	newUser();
}

	render() {

	// If wishlist number increase, animate wishlist header number
	if(this.props.wishList.length > this.state.wishList.length) {
		let wishListNumber = document.querySelector('.hsscol_fav_icon_no');
			wishListNumber.classList.add('wish_no_added');
			setTimeout(() => { wishListNumber.classList.remove('wish_no_added'); },300);
	}


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
											   onKeyDown={(e)=> this.handleSetSearchInputKey(e)}
									   	       value={this.props.searchInput}>
										</input>
									</div>
									{/* Mobile search dropdown buttons */}
									<div className='row justify-content-center'>
										<div className='smdrop_buttons col-12'>
											<Link to={'/search/'+this.props.searchInput} className='smdrop_butt mr-4' 
												  onClick={() => {this.props.setOpenMobileSearch({ openMobileSearch: false })}}>
												  Caută
											</Link>
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
											<span className='hsc_col_logo_img' onClick={()=>this.req()}>
												T-SHIRT
											</span>
											<i className='d-block d-sm-none fas fa-search hsc_col_search_mobile' onClick={() => this.openMobileSearch()}></i>
										</div>
									</div>
									<div className='hsc_col_acc col-12 col-sm-9 col-lg-10 col-xl-10 hsc_one_col'>
										<div className='row float-right'>
											<div className='hsccol_acc_cont'>
												<div className='row float-right'>
													{/* User icon */}
													<Link to={this.props.userIsSignedIn ? '/account' : '/login'}
														  onMouseOver={() => this.accountIconHoverIn()}
														  onMouseLeave={() => this.accountIconHoverOut()}
														  className='hsccol_user_icon hsccol_acc_icon'>
														  <i className='fas fa-user'></i>
													</Link>
													{/* Wishlist icon */} 
													<Link to={'/wishlist'} className='hsscol_fav_icon hsccol_acc_icon'>
															<span className='hsscol_fav_icon_no' style={{ opacity: this.props.wishList.length > 0  ? '1' : '0'}}>{this.props.wishList.length}</span>
															<i className='fas fa-heart'></i>
													</Link>
													{/* Cart icon */}
													<Link to={'/cart'} className='hsscol_cart_icon hsccol_acc_icon'>
														{this.props.cart.length > 0 && (
														<span className='hsscol_cart_icon_no'>{this.props.cart.length}</span>
														)}
														<i className='fas fa-shopping-bag'></i>
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
									<Link to={'/products/women'} className='nav_menu_link'>Femei</Link>
									<span className='nav_menu_link'>Noutati</span>
									<span className='nav_menu_link'>Custom</span>
									<span className='nav_menu_link'>Contact</span>

									{/* Search bar on large breakpoint */}
									<form className='nav_m_search form-inline d-flex justify-content-center md-form form-sm active-cyan active-cyan-2 mt-2'>
									  <Link to={'/search/'+this.props.searchInput} className='nav_m_search_btn'><i className='fas fa-search' aria-hidden='true'></i></Link>
									  <input className='form-control form-control-sm ml-3 w-75' 
									  		 type='text' 
									  		 placeholder='Caută'
									    	 aria-label='Search' 
									    	 onChange={(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									    	 onKeyDown={(e)=> this.handleSetSearchInputKey(e)}
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
									  			   placeholder='Caută'
									   	           aria-label='Search' 
									   	           onChange={(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									   	           onKeyDown={(e)=> this.handleSetSearchInputKey(e)}
									   	           value={this.props.searchInput}>
									   	    </input>
										</form>
									</div>
									)}
								</div>

								{/* Header user dropdown menu */}
								{this.state.displayUserDropdownMenu && (
								<div className='user_dropdown_menu' onMouseOver={() => { this.setState({ hoveringDropdownMenu: true })}} onMouseLeave={() => this.dropDownMenuHoverOut()}>
									{/* Not signed in dropmenu account */}
									{!this.props.userIsSignedIn ? (
									<div className='user_dropdown_menu_notsignedin'>
										<span className='udrpmenu_nots_title'>Ai cont deja?</span>
										<span className='udrpmenu_nots_subtitle'>Conecteaza-te pentru a-ti putea gestiona comenzile cu usurinta.</span>
										<Link to={'/login'} className='udrpmenu_nots_btn'>Intra in cont</Link>

										<span className='udrpmenu_nots_title udrpmenu_nots_firstvisit '>Prima vizita?</span>
										<span className='udrpmenu_nots_subtitle'>Inregistreaza-te si profita de avantajele contului.</span>
										<Link to={'/register'} className='udrpmenu_nots_btn udrpmenu_nots_regbtn'>Inregistreaza-te</Link>
									</div>
									):(
									<div className='user_dropdown_menu_signedin'>
										 
										<Link to={'/account'} className='udrmenu_sin_img'>
											{this.props.userInfo !== null && ( 
												this.props.userInfo.emailVerified ?
												<img src={this.props.userInfo.photoURL} alt=''/>
												:
												<i className='fas fa-user'></i>
											)}
										</Link>
										<span className='udrmenu_sin_title'>{this.props.userInfo !== null ? this.props.userInfo.displayName : '' }</span>
										<span className='udrmenu_sin_signout_btn' onClick={()=>this.authSignOut()}><span>Iesi din cont</span></span>

										<Link to={'/account'}              className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Profilul meu</Link>
										<Link to={'/account/myorders'}     className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Comenzile mele</Link>
										<Link to={'/account/shippingdata'} className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Date de livrare</Link>
										<Link to={'/cart'}                 className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()} style={{borderBottom: 'none'}}>Cosul meu</Link>
									</div>
									)}
								</div>
								)}
							</div>
						</div>	
						{/* Mobile drop menu*/}
						{this.state.openMobileMenu && (
						<div className='row'>
							<div className='head_mob_menu col-12'>
								<Link to={'/products/men'}       className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Barbati</Link>
								<Link to={'/products/women'}     className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Femei</Link>
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