import { SEARCH_INPUT          }  from "../constants/action-types";
import { SET_SEARCH_PRODUCTS   }  from "../constants/action-types";
import { OPEN_MOBILE_SEARCH    }  from "../constants/action-types";
import { OPEN_MED_SEARCH       }  from "../constants/action-types";
import { SET_SELECTED_PRODUCTS }  from "../constants/action-types";
import { SET_FILTERED_TERMS    }  from "../constants/action-types";
import { SET_PASSING_TAGS      }  from "../constants/action-types";
import { ADD_TO_CART           }  from "../constants/action-types";
import { ADD_TO_WISHLIST       }  from "../constants/action-types";
import { USER_SIGNED_IN        }  from "../constants/action-types";
import { SET_TOTALCART_AMOUNT  }  from "../constants/action-types";
import { SET_USER_INFO         }  from "../constants/action-types";
import { CART_IS_LOADED        }  from "../constants/action-types";
import { SIGNED_WITH_GOOGLE    }  from "../constants/action-types";
import { USER_DB_INFO          }  from "../constants/action-types";
import { MEN_PRODUCTS_DB       }  from "../constants/action-types";
import { WOMEN_PRODUCTS_DB     }  from "../constants/action-types";
import { CHILDREN_PRODUCTS_DB  }  from "../constants/action-types";
import { NEW_PRODUCTS_DB       }  from "../constants/action-types";
 
 
export function setNewProductsDb(payload) {
  return { type: NEW_PRODUCTS_DB, payload };
}
export function setWomenProductsDb(payload) {
  return { type: WOMEN_PRODUCTS_DB, payload };
}
export function setMenProductsDb(payload) {
  return { type: MEN_PRODUCTS_DB, payload };
}
export function setChildrenProductsDb(payload) {
  return { type: CHILDREN_PRODUCTS_DB, payload };
}
export function setUserDbInfo(payload) {
  return { type: USER_DB_INFO, payload };
}
export function setSignedWithGoogle(payload) {
  return { type: SIGNED_WITH_GOOGLE, payload };
}
export function setCartIsLoaded(payload) {
  return { type: CART_IS_LOADED, payload };
}
export function setUserInfo(payload) {
  return { type: SET_USER_INFO, payload };
}
export function setTotalCartAmount(payload) {
  return { type: SET_TOTALCART_AMOUNT, payload };
}
export function setUserIsSignedIn(payload) {
  return { type: USER_SIGNED_IN, payload };
}
export function setCart(payload) {
  return { type: ADD_TO_CART, payload };
}
export function setWishList(payload) {
  return { type: ADD_TO_WISHLIST, payload };
}
export function setPassingTags(payload) {
  return { type: SET_PASSING_TAGS, payload };
}
export function setFilteredTerms(payload) {
  return { type: SET_FILTERED_TERMS, payload };
}
export function setSelectedProducts(payload) {
  return { type: SET_SELECTED_PRODUCTS, payload };
}
export function setSearchProducts(payload) {
  return { type: SET_SEARCH_PRODUCTS, payload };
}
export function setSearchInput(payload) {
  return { type: SEARCH_INPUT, payload };
}
export function setOpenMobileSearch(payload) {
  return { type: OPEN_MOBILE_SEARCH, payload };
}
export function setOpenMediumSearch(payload) {
  return { type: OPEN_MED_SEARCH, payload };
}