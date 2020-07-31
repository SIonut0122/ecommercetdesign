
import { SET_SEARCH_PRODUCTS   }  from "./constants/action-types";
import { SEARCH_INPUT          }  from "./constants/action-types";
import { OPEN_MOBILE_SEARCH    }  from "./constants/action-types";
import { OPEN_MED_SEARCH       }  from "./constants/action-types";
import { SET_SELECTED_PRODUCTS }  from "./constants/action-types";
import { SET_FILTERED_TERMS    }  from "./constants/action-types";
import { SET_PASSING_TAGS      }  from "./constants/action-types";
import { ADD_TO_WISHLIST       }  from "./constants/action-types";
import { USER_SIGNED_IN        }  from "./constants/action-types";
import { ADD_TO_CART           }  from "./constants/action-types";
import { SET_TOTALCART_AMOUNT  }  from "./constants/action-types";
import { SET_USER_INFO         }  from "./constants/action-types";
import { CART_IS_LOADED        }  from "./constants/action-types";
import { SIGNED_WITH_GOOGLE    }  from "./constants/action-types";
import { USER_DB_INFO          }  from "./constants/action-types";
import { MEN_PRODUCTS_DB       }  from "./constants/action-types";
import { WOMEN_PRODUCTS_DB     }  from "./constants/action-types";
import { CHILDREN_PRODUCTS_DB  }  from "./constants/action-types";
import { NEW_PRODUCTS_DB       }  from "./constants/action-types";


    const initialState = {
         userIsSignedIn         : null,
         signedWithGoogle       : false,
         userDbInfo             : null,
         selectedProducts       :  null, 
         searchInput            : '',
         openMobileSearch       : false,
         openMediumSearch       : false,
         propsFilteredTerms     : [],
         propsPassingTags       : { price: { lowHigh: false, highLow: false }, newer: { newer: false} },
         wishList               : [],
         cart                   : [],
         cartIsLoaded           : false,
         totalCartAmount        : 0,
         userInfo               : null,

         menProductsDataDb      : null,
         womenProductsDataDb    : null,
         childrenProductsDataDb : null,
         newProductsDataDb      : null,
  }



    function rootReducer(state = initialState, action) {

    
      switch(action.type) {
        case SET_SELECTED_PRODUCTS: 
           return Object.assign({}, state, {
          selectedProducts: action.payload.selectedProducts
        });
        break;
        case SEARCH_INPUT:
           return Object.assign({}, state, {
          searchInput: action.payload.searchInput
        });
        break;
        case OPEN_MOBILE_SEARCH:
           return Object.assign({}, state, {
          openMobileSearch: action.payload.openMobileSearch
        });
        break;
        case OPEN_MED_SEARCH:
           return Object.assign({}, state, {
          openMediumSearch: action.payload.openMediumSearch
        });
        break;
        case SET_FILTERED_TERMS:
           return Object.assign({}, state, {
          propsFilteredTerms: action.payload.propsFilteredTerms
        });
        break;
        case SET_PASSING_TAGS:
           return Object.assign({}, state, {
          propsPassingTags: action.payload.propsPassingTags
        });
        break;
        case ADD_TO_WISHLIST:
           return Object.assign({}, state, {
          wishList: action.payload.wishList
        });
        break;
        case ADD_TO_CART:
           return Object.assign({}, state, {
          cart: action.payload.cart
        });
        break;
        case SET_TOTALCART_AMOUNT:
           return Object.assign({}, state, {
          totalCartAmount: action.payload.totalCartAmount
        });
        break;
        case CART_IS_LOADED:
           return Object.assign({}, state, {
          cartIsLoaded: action.payload.cartIsLoaded
        });
        break;
        case USER_SIGNED_IN:
           return Object.assign({}, state, {
          userIsSignedIn: action.payload.userIsSignedIn
        });
        break;
        case SET_USER_INFO:
           return Object.assign({}, state, {
          userInfo: action.payload.userInfo
        });
        break;
        case USER_DB_INFO:
           return Object.assign({}, state, {
          userDbInfo: action.payload.userDbInfo
        });
        break;
        case SIGNED_WITH_GOOGLE:
           return Object.assign({}, state, {
          signedWithGoogle: action.payload.signedWithGoogle
        });
        break;
        case MEN_PRODUCTS_DB:
           return Object.assign({}, state, {
          menProductsDataDb: action.payload.menProductsDataDb
        });
        break;
        case WOMEN_PRODUCTS_DB:
           return Object.assign({}, state, {
          womenProductsDataDb: action.payload.womenProductsDataDb
        });
        break;
        case CHILDREN_PRODUCTS_DB:
           return Object.assign({}, state, {
          childrenProductsDataDb: action.payload.childrenProductsDataDb
        });
        break;
         case NEW_PRODUCTS_DB:
           return Object.assign({}, state, {
          newProductsDataDb: action.payload.newProductsDataDb
        });
        break;

      }

      return state;
    }



  export default rootReducer;