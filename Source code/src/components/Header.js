import   React                  from 'react';
import { connect             }  from "react-redux";
import { client, q           }  from '../fauna/db';
import { Link, Redirect      }  from 'react-router-dom'
import { setSearchInput,
		 setOpenMobileSearch, 
		 setOpenMediumSearch,
		 setSelectedProducts,
		 setUserIsSignedIn,
		 setUserInfo,
		 setWishList, setCart,
		 setSignedWithGoogle,
		 setUserDbInfo        } from '../actions'; 
import   getAllUsers            from '../fauna/getAllUsers'
import   womenProductsData      from '../data/women';
import   menProductsData        from '../data/men';
import   childrenProductsData   from '../data/children';
import '../css/Header.css';







const mapStateToProps = state => {
  return {  
  		  userIsSignedIn   : state.userIsSignedIn,
  		  userInfo         : state.userInfo,
  		  userDbInfo       : state.userDbInfo,
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
		displayUserDropdownMenu : false,
		hoveringAccountIcon     : false,
		hoveringDropdownMenu    : false,
		wishList                : this.props.wishList,
		openSortByMenu          : false,
		openMobileMenu          : false
	}
}

componentDidMount() {
	window.addEventListener('resize', (e) =>this.handleHeaderResize(e));

	// Bind action to nav menu links buttons
	if(document.contains(document.querySelector('.nav_menu_link'))) {
		let navMenuLinks = document.querySelectorAll('.nav_menu_link');
			navMenuLinks.forEach(el => {
				el.addEventListener('click', () => this.handleNavMenuLinkClick());
			})
	}  

	// Call function to initiate user session
	this.authListener();

	// Handle focus outline on mouse / keyboard
    document.body.addEventListener('mousedown', function() {
      document.body.classList.add('using-mouse');
    });
    document.body.addEventListener('keydown', function() {
      document.body.classList.remove('using-mouse');
    });


     	setTimeout(() => {
    		this.checkCookies();
		},2000);
/*// SEND DATA TO DB
	client.query(
  q.Map(
      childrenProductsData,
    q.Lambda(
      'children_products',
      q.Create(
        q.Collection('children'),
        {  data: q.Var('children_products') },
      )
    ),
  )
)
.then((ret) => console.log(ret))*/


}

 

componentDidUpdate(prevProps) {
	// If wishlist number increase, animate wishlist header icon number
	if(prevProps.wishList !== this.props.wishList) {
		if(document.contains(document.querySelector('.hsscol_fav_icon_no'))) {
		let wishListNumber = document.querySelector('.hsscol_fav_icon_no');
			// Add class to animate number
			wishListNumber.classList.add('wish_no_added');
			// Remove animation class after 0.3 sec
			setTimeout(() => { wishListNumber.classList.remove('wish_no_added'); },300);
		}
	}
}
 
authListener() {
 
			// if user is logged in, set state user to user and use the data
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        	this.props.setUserInfo({ userInfo: user })
        	this.props.setUserIsSignedIn({ userIsSignedIn: true })
            this.props.setSignedWithGoogle({ signedWithGoogle: user.emailVerified})
 			console.log('User is  signed in');
 			this.fetchDbUser(user);

	     } else {	
	    	console.log('User is not signed in');
	    	this.props.setUserIsSignedIn({ userIsSignedIn: false })
	    	this.props.setUserInfo({ userInfo: null })

	    	// UPDATE WISHLIST FROM LOCALSTORAGE		
			console.log('Header: wishlist/cart localstoraged and populated');
			if (window.localStorage.getItem('wishList') !== null) {
	          let wishlistLS = JSON.parse(localStorage.getItem('wishList'));
	          this.props.setWishList({ wishList: wishlistLS })
	    	}
	    	// UPDATE CART FROM USERDB
			if (window.localStorage.getItem('cart') !== null && !this.props.cart.length > 0 ) {
		 	  let cartStorage = JSON.parse(localStorage.getItem('cart'));
		 	  this.props.setCart({ cart: cartStorage })
			}
	    }
    });
}


authSignOut() {
	// Signout and reload
	firebase.auth().signOut().then(() => {
		// Sign out after 0.5sec
		setTimeout(() => {
	 		window.location.reload();
		},500);
	}).catch(function(error) {
	  console.log('An error occurred while signing out');
	});
}



async fetchDbUser(userAuth) {

	const get = await getAllUsers
		.then((users) => {
		let usersDB    = users,
		    userExists = false,
		// Collect all emails for double user check
		    emails = [];
			usersDB.forEach((el) => emails.push(el.data.email));

		for(let c in usersDB) {
			// If signed user match with any email and uid from db
			if(usersDB[c].data.email === userAuth.email && usersDB[c].data.uid === userAuth.uid) {
				// If collected emails contains signed users email, , set 'userExists' to true 
				if(emails.includes(usersDB[c].data.email)) {
					  userExists = true;
					  console.log('Users exists, DB SET');
				
					  // Set userDb props info and state to render
					  this.props.setUserDbInfo({ userDbInfo: usersDB[c] })

					  console.log('Header: wishlistDB, cartDB pouplated');
					  // If data is undefined (when data is null on faunaDB, data is deleted ->undefined)
					  this.props.setWishList ({ wishList: usersDB[c].data.wishlist !== undefined ? usersDB[c].data.wishlist : [] })
					  this.props.setCart     ({ cart: usersDB[c].data.cart !== undefined ? usersDB[c].data.cart : [] })
				}
			}
		}
		// If userexists remains false, create new user
		if(!userExists) {
			console.log('Creating user...');
			this.createNewDbUser(userAuth);
		}
	   
	})
 
}


createNewDbUser(userAuth) {
	console.log(userAuth);
	let newUserData = {
		  email        : userAuth.email.toLowerCase(),
		  uid          : userAuth.uid,
		  displayName  : userAuth.displayName === null ? 'este null' : userAuth.displayName,
		  cart         : null,
		  wishlist     : null,
		  myprofile    : {lastname:'',name:'',gender:'',phone:''},
		  myorders     : null,
		  shippingdata : {lastname:'',name:'',street:'',postalCode:'',city:'',village:'',addInfo:''}
	};

	// Create a new user with those prop on database
	client.query(
	  q.Create(
	    q.Collection('users'),
	    { data: newUserData },
	  )
	)
	.then((newUserCreated) => { 
	  console.log('New user was created.');
	  // Set userDb props after user was created
	  this.props.setUserDbInfo ({ userDbInfo: newUserCreated })
	 })
	.catch((err) => {
		console.log('Something went wrong while creatint new user');
	})

}


componentWillUnmount() {
	// Use this to restyle page depending of page size
	window.removeEventListener('resize', (e) => this.handleHeaderResize(e));
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

renderUsername() {
	// If userDb has a lastname available, use it
	if(this.props.userDbInfo !== null && this.props.userDbInfo.data.myprofile.lastname.length > 0) {
			return this.props.userDbInfo.data.myprofile.lastname;
	} else {
	// Instead, if user hasn't completed the lastname input, use the displayName from firebase auth account
 		if(this.props.userIsSignedIn && this.props.userInfo !== null && this.props.userInfo.displayName !== undefined) {
	 		return this.props.userInfo.displayName;
 		}
	}
}

handleNavMenuLinkClick() {
	// Scoll to top on every mount
	window.scrollTo(0, 0);
}

checkCookies() {
	// If cookies were not accepted,display cookies banner
	if(window.localStorage.getItem('cookies_accepted') === null) {
		document.querySelector('.cookies_ban').style.display = 'block';
		setTimeout(() => {
			document.querySelector('.cookies_txt').style.height = '40px';
		},500);
	}

 
}
acceptCookies() {
	// Hide cookies banner and set localstorage accepted cookies
	document.querySelector('.cookies_txt').style.height = '0';
	setTimeout(() => {
		document.querySelector('.cookies_ban').style.display = 'none';
	},1000);

	let coOk = 'ok';
	localStorage.setItem('cookies_accepted', JSON.stringify(coOk));

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
					    		<i className='fas fa-phone'></i>
					    		<span className='h_social_phone'>0727 464 5671</span>
					    		<i className='fab fa-whatsapp'></i>
					    		<span className='h_social_whatapp'>0734 124 6404</span>

					    		{this.props.userIsSignedIn && this.props.userDbInfo !== null && this.props.userDbInfo.data.access_granted === 'mod' && (
					    		<div className='head_wrap_admin_cpanel'>
					    			<div className='row justify-content-center'>
					    				<i className='fas fa-cogs'></i>
					    				<Link to={'/dashboard'}>Panou de control</Link>
					    			</div>	
					    		</div>
					    		)}
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
											<Link to={'/'} className='hsc_col_logo_img'></Link>
											<i className='d-block d-sm-none fas fa-search hsc_col_search_mobile' onClick={() => this.openMobileSearch()}></i>
										</div>
									</div>
									<div className='hsc_col_acc col-12 col-sm-9 col-lg-10 col-xl-10 hsc_one_col'>
										<div className='row float-right'>
											<div className='hsccol_acc_cont'>
												<div className='row float-right'>
													{/* User icon */}
													<Link to={this.props.userIsSignedIn ? '/account' : '/login'}
														  onMouseOver  = {() => this.accountIconHoverIn()}
														  onMouseLeave = {() => this.accountIconHoverOut()}
														  className    = 'hsccol_user_icon hsccol_acc_icon'>
														  <i className = 'fas fa-user'></i>
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
									<Link to={'/products/men'}      className='nav_menu_link nav_menu_men'><span>Bărbați</span></Link>
									<Link to={'/products/women'}    className='nav_menu_link nav_menu_women'><span>Femei</span></Link>
									<Link to={'/products/children'} className='nav_menu_link nav_menu_children'><span>Copii</span></Link>
									<Link to={'/products/new'}      className='nav_menu_link nav_menu_new'><span>Noutăți</span></Link>
									<Link to={'/contact'}           className='nav_menu_link nav_menu_contact nav_mlink_men'><span>Contact</span></Link>

									{/* Search bar on large breakpoint */}
									<form className='nav_m_search form-inline d-flex justify-content-center md-form form-sm active-cyan active-cyan-2 mt-2'>
									  <Link to={'/search/'+this.props.searchInput} className='nav_m_search_btn' style={{pointerEvents: !this.props.searchInput.length > 0 ? 'none' : 'visible'}}><i className='fas fa-search' aria-hidden='true'></i></Link>
									  <input className   = 'form-control form-control-sm ml-3 w-75' 
									  		 type        = 'text' 
									  		 placeholder = 'Caută'
									    	 aria-label  = 'Search' 
									    	 onChange    = {(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									    	 onKeyDown   = {(e)=> this.handleSetSearchInputKey(e)}
									    	 value       = {this.props.searchInput}>
									   </input>
									</form>

									{/* Search bar on medium breakpoint */}
									{!this.props.openMediumSearch && (
									<i className='fas fa-search nav_m_search_med d-lg-none' onClick={() => this.openMedSizeSearch()}></i>
									)}

									{/* If searach bar medium is displayed, display search icon */}
									{this.props.openMediumSearch && ( 
										<Link to={'/search/'+this.props.searchInput} style={{pointerEvents: !this.props.searchInput.length > 0 ? 'none' : 'visible'}}><i className='fas fa-search nav_m_search_med d-lg-none'></i></Link>
									)}
									{this.props.openMediumSearch && (
									<div className='nav_search_medium_input'>
										<span onClick={() => this.openMedSizeSearch()}>&times;</span>
										<form className='form-inline d-flex justify-content-center md-form form-sm mt-2'>
									  		<input className   = 'form-control form-control-sm w-80' 
									  			   type        = 'text' 
									  			   placeholder = 'Caută'
									   	           aria-label  = 'Search' 
									   	           onChange    = {(e) => {this.props.setSearchInput({ searchInput: e.target.value })}} 
									   	           onKeyDown   = {(e)=> this.handleSetSearchInputKey(e)}
									   	           value       = {this.props.searchInput}>
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
										<span className='udrpmenu_nots_subtitle'>Conectează-te pentru a-ți putea gestiona comenzile cu usurință.</span>
										<Link to={'/login'} className='udrpmenu_nots_btn'>Intră în cont</Link>

										<span className='udrpmenu_nots_title udrpmenu_nots_firstvisit '>Prima vizită?</span>
										<span className='udrpmenu_nots_subtitle'>Înregistrează-te și profită de avantajele contului.</span>
										<Link to={'/register'} className='udrpmenu_nots_btn udrpmenu_nots_regbtn'>Înregistrează-te</Link>
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
										<span className='udrmenu_sin_title'>{this.renderUsername()}</span>
										<span className='udrmenu_sin_signout_btn' onClick={()=>this.authSignOut()}><span>Ieși din cont</span></span>

										<Link to={'/account'}              className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Profilul meu</Link>
										<Link to={'/account/myorders'}     className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Comenzile mele</Link>
										<Link to={'/account/shippingdata'} className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()}>Date de livrare</Link>
										<Link to={'/cart'}                 className='udrmenu_sin_menu_btn' onClick={()=>this.handleAccDropdownClick()} style={{borderBottom: 'none'}}>Coșul meu</Link>
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
								<Link to={'/products/men'}       className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Bărbați</Link>
								<Link to={'/products/women'}     className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Femei</Link>
								<Link to={'/products/children'}  className='h_mob_menu_btn' onClick={()=>this.handleMobileMenu()}>Copii</Link>
								<Link to={'/products/contact'}   className='h_mob_menu_btn' style={{borderBottom:'1px solid transparent'}} onClick={()=>this.handleMobileMenu()}>Contact</Link>
								{this.props.userIsSignedIn && this.props.userDbInfo !== null && this.props.userDbInfo.data.access_granted === 'mod' && (
								<Link to={'/dashboard'}          className='h_mob_menu_btn hmob_menu_cplink' onClick={()=>this.handleMobileMenu()}>Panou de control</Link>
								)}
							</div>
						</div>
						)}

						<div className='cookies_ban'>
						<span className='cookies_txt'>Acest site folosește cookies <span onClick={()=>this.acceptCookies()}>OK</span></span>
						</div>
					</div> {/* End of Header container */}
				</div>  {/* End of Header container row */}
			</div>
		)
	}
}

const Header = connect(mapStateToProps,mapDispatchToProps)(connectedHeader);
export default Header;