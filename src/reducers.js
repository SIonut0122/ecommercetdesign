
import objectProducts from './products';
import { SET_SEARCH_PRODUCTS }  from "./constants/action-types";
import { SEARCH_INPUT }  from "./constants/action-types";
import { OPEN_MOBILE_SEARCH }  from "./constants/action-types";
import { OPEN_MED_SEARCH }  from "./constants/action-types";

 
 
    const initialState = {
         objectProducts:  objectProducts, 
         searchResults: null,
         searchInput: '',
         openMobileSearch: false,
         openMediumSearch: false
  }



    function rootReducer(state = initialState, action) {

    
      switch(action.type) {
        case SET_SEARCH_PRODUCTS: 
           return Object.assign({}, state, {
          searchResults: action.payload.searchResults
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
      }

      return state;
    }



  export default rootReducer;