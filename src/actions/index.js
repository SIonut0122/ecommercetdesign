
import { SEARCH_INPUT }        from "../constants/action-types";
import { SET_SEARCH_PRODUCTS }        from "../constants/action-types";
import { OPEN_MOBILE_SEARCH }        from "../constants/action-types";
import { OPEN_MED_SEARCH }        from "../constants/action-types";


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