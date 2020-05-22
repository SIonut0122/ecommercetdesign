import React from 'react';
import '../css/DisplayProductsContainer.css';
import objectProducts from '../products';
import RenderProducts from '../renderProducts';
import { connect }            from "react-redux";
import { setOpenMediumSearch } from '../actions';


const mapStateToProps = state => {
  return {  
          objectProducts   : state.objectProducts,
          searchInput      : state.searchInput,
          openMobileSearch : state.openMobileSearch
        };
};

function mapDispatchToProps(dispatch) {
  return {
          setOpenMediumSearch : bol  => dispatch(setOpenMediumSearch(bol)),
        };
}

class connectedDisplayProductsContainer extends React.Component {

  state = {
     category :   ['t-shirt','pajamas','pants','robe','sweater' ],
     color    :   ['black','red','white','purple','green','yellow','brown','pink'],
     gender   :   ['boy','girl'],
     material :   ['modal','cotton','spandex'],
     size     :   ['S','M','L','XL','XXL'],


     filteredTerms: [],
     sortByPrice: null, 
     sortByNewer: false,
     stateObjProducts: this.props.objectProducts,


     passingTags: {
       price:    { lowHigh: false, highLow: false },
       newer:    { newer: false},
       color:    { white: false, black: false,brown: false,yellow: false,pink: false,purple: false,red: false, green: false },
       gender:   { girl: false, boy: false },
       material: { modal: false,cotton: false,spandex: false },
       category: { robe: false,pajamas: false,sweater: false,pants: false },
       size:     { S: false, M: false, L: false, XL: false, XXL: false }
     },
     collectedTrueKeys: null
  }

componentDidMount() {

}

setFilter(value, filterProp) {
    let filteredTerms = [...this.state.filteredTerms];

    // Check if selected filter already exists inside filteredTerms
    const alreadyIncluded = filteredTerms.some((el) => el.filPropValue === value);
    // If already exists, delete it
    if(alreadyIncluded) {
      let removeExisting = filteredTerms.filter((el) => el.filPropValue !== value);
          filteredTerms  = removeExisting;
    } else {
    // Else, create new object with "filProp" as filter title and "filPropValue" as value
      let newFilObj                 = {};
          newFilObj["filProp"]      = filterProp;
          newFilObj["filPropValue"] = value;
          filteredTerms.push(newFilObj);
    }

    this.setState( prevState => ({
     filteredTerms,
     passingTags: {
      ...prevState.passingTags, // Get, set prevState and inside passingTags search for the filter propriety 
      [filterProp]: {          // Get prevState of filter prop and set it to false (ex: color: {".green": false})
        ...prevState.passingTags[filterProp],
        [value]: !prevState.passingTags[filterProp][value]
      }
     }
    })
    )
}



filteredCollected = () => {
    const collectedTrueKeys = {
      color    : [],
      gender   : [],
      material : [],
      category : [],
      size     : []
    };

    // Loop through clicked boolean filters and add to collectedTrueKeys object any true value

    const { color, gender, material, category, size } = this.state.passingTags;

    for (let colorKey in color) {
      if (color[colorKey]) collectedTrueKeys.color.push(colorKey);
    }
    for (let genderKey in gender) {
      if (gender[genderKey]) collectedTrueKeys.gender.push(genderKey);
    }
    for (let materialKey in material) {
      if (material[materialKey]) collectedTrueKeys.material.push(materialKey);
    }
    for (let categoryKey in category) {
      if (category[categoryKey]) collectedTrueKeys.category.push(categoryKey);
    }
    for (let sizeKey in size) {
      if (size[sizeKey]) collectedTrueKeys.size.push(sizeKey);
    }

    // Return to be used by searchProducts function
    return collectedTrueKeys;
}

multiPropsFilter = (products, filters) => {
  
    // Get object keys from collectedTrueKeys (['color','gender'...])
    const filterKeys = Object.keys(filters);
    // Filter products
    return products.filter(product => {
      return filterKeys.every(key => {
        // // If filterKeys is not an array (has no length), continue
        if (!filters[key].length) return true;
        // Loops again if product[key] is an array (for material attribute).
        if (Array.isArray(product[key])) {
          // Check if at least one element match
          return product[key].some(keyEle => filters[key].includes(keyEle));
        }
        return filters[key].includes(product[key]);
      });
    });
}

searchProducts = () => {
  // Takes in all product list and filter to return the filtered product list.
    const filteredProducts = this.multiPropsFilter(
      this.state.stateObjProducts,
      this.filteredCollected()
    );

  // Return product by name; If the search input is not empty, use it and see if
     // resulted product includes the input text
    return filteredProducts.filter(product => {
      // Return product name which includes value from search input
      return product.name
        .toLowerCase()
        .includes(this.props.searchInput);
    });

}


clearFilterTag(term) {
    // Remove clicked filter tag
    this.setState(prevState => ({
    // Remove filter tag from the showing list 
    filteredTerms: [...prevState.filteredTerms].filter((el) => el.filPropValue !== term.filPropValue),
    // Search inside passingTags for the 'term.filPropValue' and set it to false
       // passingTags[term.filProp][term.filPropValue] = passingTags[category]['t-shirt']
    passingTags: {...prevState.passingTags,
      [term.filProp]: {...prevState.passingTags[term.filProp],
        [term.filPropValue]: !prevState.passingTags[term.filProp][term.filPropValue]
      }
    }
  }))
}



clerAllFilters() {
  let term = this.state.filteredTerms;
 // Loop through passingTags and set all filters to false
  for(let k in term) {
    this.setState(prevState => ({
      passingTags: {
        ...prevState.passingTags,
        [term[k].filProp]: {
          ...prevState.passingTags[term[k].filProp],
          [term[k].filPropValue]: false
        }
      },
      // Clear filteredTerms too
      filteredTerms: []
    }))
   }
}

handleMainContainerClick() {

  /* Sort by menu */
  document.querySelector('.sortby_caret_down').classList.remove('sortbycaret_active');
  if(this.state.openSortByMenu) {
    this.setState({ openSortByMenu: false })
  }

  /* Close medium search input if displayed */
  this.props.setOpenMediumSearch({ openMediumSearch: false })
}


/*________ SORT BY ACTIONS ________ */

handleOpenSortBy(e) {
  // On container click, close order by menu. Avoid this with stopProp.
  e.stopPropagation();
  let sortByDownArrow = document.querySelector('.sortby_caret_down');
  // Animate caret down arrow and open/close orderBy
  sortByDownArrow.classList.toggle('sortbycaret_active')
  this.setState({ openSortByMenu: !this.state.openSortByMenu})
}

sortBy = (filterProp, pick, unpick) =>  {
  switch(filterProp) {
    case 'price':
      this.setState(
        prevState => ({
          passingTags: {
            ...this.state.passingTags,
              price: { [pick]: !prevState.passingTags.price[pick], [unpick]: false },
              newer: { newer: false }
          }
        }), () => this.sortProducts(pick)
      )
    break;
    case 'newer':
       this.setState(
        prevState => ({
          passingTags: {
            ...this.state.passingTags,
              newer: { newer: !prevState.passingTags.newer.newer },
              price: { highLow: false, lowHigh: false },
          }  
        }), () => this.sortProducts('newer')
      )
    break;
    default:
     this.setState(
        prevState => ({
          passingTags: {
            ...this.state.passingTags,
              newer: { newer: false },
              price: { highLow: false, lowHigh: false },
          }
        }), () => this.sortProducts('default')
      )
  }  
}

sortProducts = sortArgument => {
    if (sortArgument === "lowHigh" && this.state.passingTags.price.lowHigh) {
      
      this.state.stateObjProducts.sort((x, y) => x.price - y.price);
      this.setState({ sortByPrice: true, sortByNewer: false }) // Only to update state render

    } else if ( sortArgument === "highLow" && this.state.passingTags.price.highLow) {
      
      this.state.stateObjProducts.sort( (x, y) => y.price - x.price );
      this.setState({ sortByPrice: false, sortByNewer: false }) // Only to update state render

    } else if (sortArgument === 'newer' && this.state.passingTags.newer.newer) {
         
      this.state.stateObjProducts.sort((a, b) => b.new - a.new);
      this.setState({ sortByNewer: true })
    } else {
       // Default order; Order by id
      this.state.stateObjProducts.sort( (x, y) => x.id - y.id );
      this.setState({ sortByPrice: null, sortByNewer: false }) // Only to update state render
    } 
}






  render() { 
    return (
        <div>
          <div className='row justify-content-center'>
           <div className='g_container col-12' onClick={()=>this.handleMainContainerClick()}>

              {/* Filter and order by - Hide when mobile search dropmenu is down */}
              {!this.props.openMobileSearch && (
                <div className='row'>
                  <div className='head_filterorder_div col-12'>
                    <div className='row  justify-content-center'>
                      <div className='h_filter_cont h_filord_cont col-4 col-md-4'>
                        <div className='row'>
                          <div className='h_mobile_filter_button'>
                            {/* Filter icon */}
                            <svg className="bi bi-filter" width="20px" height="20px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M6 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                            </svg>
                            <span className='fhilter_mob_txt'>Filtru</span>
                            {/* Down arrow */}
                            <svg className="bi bi-caret-down-fill" width="10px" height="10px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Filter results text */}
                      <div className='h_filter_results_cont d-none d-md-block h_filord_cont col-4'>
                        <span>{this.state.stateObjProducts.length} articole gasite</span>
                      </div>
                      {/* Order by section */}
                      <div className='h_order_cont h_filord_cont col-8 col-md-4'>
                        <div className='row'>
                          <div className='h_orderby_button' onClick={(e)=>this.handleOpenSortBy(e)}>
                            {/* Order by list icon */}
                            <svg className="bi bi-list-ol" width="19px" height="19px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                              <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 01-.492.594v.033a.615.615 0 01.569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 00-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
                            </svg>
                            <span className='horderby_txt'>Sortare dupa</span>
                            {/* Down arrow */}
                            <svg className="bi bi-caret-down-fill sortby_caret_down" width="14px" height="14px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sort by dropdown */}
                  
                    {this.state.openSortByMenu && (
                    <div className='sort_by_dropdown' onClick={(e) => {e.stopPropagation()}}>
                        <div className='row justify-content-center'>
                        <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('price','lowHigh','highLow')}>
                          <input type="radio" name="myfilter_radio" defaultChecked={this.state.passingTags.price.lowHigh ? true : false} className="sortby_prop custom-control-input"></input>
                          <div className="custom-control-label">Pret crescator </div>
                        </label>

                        <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('price','highLow','lowHigh')}>
                          <input type="radio" name="myfilter_radio" defaultChecked={this.state.passingTags.price.highLow ? true : false} className="sortby_prop custom-control-input"></input>
                          <div className="custom-control-label">Pret descrescator</div>
                        </label>

                        <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('newer')}>
                          <input type="radio" name="myfilter_radio" defaultChecked={this.state.sortByNewer ? true : false} className="sortby_prop custom-control-input"></input>
                          <div className="custom-control-label">Cel mai nou</div>
                        </label>

                        <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('default')}>
                          <input type="radio" name="myfilter_radio" defaultChecked={!this.state.passingTags.price.lowHigh && !this.state.passingTags.price.highLow && !this.state.sortByNewer ? true : false} className="sortby_prop custom-control-input"></input>
                          <div className="custom-control-label">Ordine implicita</div>
                        </label>

                       </div>
     
                    </div>
                    )}
                 
                  </div> {/* End of Filter and order by */}
                </div>   
              )}
{/*           <span>Price</span>
           <span className='button_fil' onClick={(e) => this.sortPrice('lowHigh','highLow')}>
            {this.state.passingTags.price.lowHigh && (<span className='x_remove'> &times; </span> )}
            $ Low - High
           </span>
           <span className='button_fil' onClick={(e) => this.sortPrice('highLow','lowHigh')}>
            {this.state.passingTags.price.highLow && (<span className='x_remove'> &times; </span> )}
            $ High - Low
           </span>

           <br/><br/>
           <span>Gender</span>
           {this.state.gender.map((gend,ind) => <span className='button_fil' key={ind} onClick={(e) => this.setFilter(gend,'gender')}>{gend}</span>)}
          
            <br/><br/>

           <span>Colors</span>
           {this.state.color.map((col,ind) => <span className='button_fil' key={ind} onClick={(e) => this.setFilter(col,'color')}>{col}</span>)}
          
            <br/><br/>
            
           <span>Material</span>
           {this.state.material.map((mat,ind) => <span className='button_fil' key={ind} onClick={(e) => this.setFilter(mat,'material')}>{mat}</span>)}


            <br/><br/>
            
           <span>Category</span>
           {this.state.category.map((cat,ind) => <span className='button_fil' key={ind} onClick={(e) => this.setFilter(cat,'category')}>{cat}</span>)}

           <br/><br/>
            
           <span>Size</span>
           {this.state.size.map((siz,ind) => <span className='button_fil' key={ind} onClick={(e) => this.setFilter(siz,'size')}> {siz} </span>)}

           <br/><br/>
           <div>
              Filters: {this.state.filteredTerms.map((term,ind) => <span key={ind} onClick={(e) => this.clearFilterTag(term)}> {term.filPropValue} </span>)}
              {this.state.filteredTerms.length > 0 && (
              <span className='button_fil' onClick={() => this.clerAllFilters()}>Clear all</span>
              )}
           </div>
           <br/><br/>
     

          <br/>
*/}

            <div className='row justify-content-center'>
              <div className='wrap_box col-10'>
                  <RenderProducts products={this.searchProducts()}/>
              </div>
            </div>

            </div>
          </div>
      </div>
    );
  }
}


const DisplayProductsContainer = connect(mapStateToProps,mapDispatchToProps)(connectedDisplayProductsContainer);
export default DisplayProductsContainer;

