import   React                 from 'react';
import   RenderProducts        from './renderProducts';
import { connect             } from "react-redux";
import { Link, useLocation   } from 'react-router-dom';
import { setOpenMediumSearch,
         setSelectedProducts,
         setFilteredTerms,
         setPassingTags       } from '../actions';
import   filterArrow            from '../images/filter_arrow.png';
import '../css/Products.css';
 



const mapStateToProps = state => {
  return {  
          propsPassingTags   : state.propsPassingTags,
          propsFilteredTerms : state.propsFilteredTerms,
          openMobileSearch   : state.openMobileSearch,
          searchResults      : state.searchResults,
          searchInput        : state.searchInput,

        };
};

function mapDispatchToProps(dispatch) {
  return {
          setOpenMediumSearch : bol      => dispatch(setOpenMediumSearch(bol)),
          setSelectedProducts : prod     => dispatch(setSelectedProducts(prod)),
          setFilteredTerms    : terms    => dispatch(setFilteredTerms(terms)),
          setPassingTags      : passTags => dispatch(setPassingTags(passTags))
        };
}

class connectedProducts extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
         // Used to display filter menu lists
         filterChildrenCategory : [{catRo: 'Baieti',catEng: 'boys'},{catRo: 'Fete',catEng: 'girls'},{catRo: 'Unisex',catEng: 'unisex'}],
         filterCategory         : [{catRo: 'Barbati',catEng: 'men'},{catRo: 'Femei',catEng: 'women'},{catRo: 'Copii',catEng: 'children'}],
         filterColors           : [{colorRo:'Alb',colorEng:'white'},{colorRo:'Negru',colorEng:'black'},{colorRo:'Albastru',colorEng:'blue'},{colorRo:'Rosu',colorEng:'red'},{colorRo:'Verde',colorEng:'green'},{colorRo:'Galben',colorEng:'yellow'},{colorRo:'Maro',colorEng:'brown'},{colorRo:'Mov',colorEng:'purple'},{colorRo:'Roz',colorEng:'pink'},{colorRo:'Argintiu',colorEng:'silver'},{colorRo:'Gri',colorEng:'gray'},{colorRo:'Auriu',colorEng:'gold'},{colorRo:'Azur',colorEng:'azure'},{colorRo:'Bleumarin',colorEng:'navy'},{colorRo:'Kaki',colorEng:'khaki'},{colorRo:'Verde deschis',colorEng:'lightgreen'},{colorRo:'Coral',colorEng:'coral'},{colorRo:'Fuchsia',colorEng:'fuchsia'}],
         filterSize             : ['XS','S','M','L','XL','XXL','3XL'],
         filterMaterial         : [{matEng: 'cotton',matRo: 'Bumbac'},{matEng: 'polyester',matRo: 'Poliester'},{matEng: 'organic',matRo: 'Organic'}],
         filterNeckType         : [{neckTypeEng: 'roundneck', neckTypeRo: 'Guler rotund'},{neckTypeEng: 'vneck', neckTypeRo: 'decolteu in V'},{neckTypeEng: 'withcollar', neckTypeRo: 'Cu guler'},{neckTypeEng: 'hooded', neckTypeRo: 'Cu glugă'}],
         filterPrint            : [{printEng: 'message', printRo: 'Cu mesaj'},{printEng: 'graphic', printRo: 'Grafic'}],        

         filteredTerms          : [],                          // Collected filtered terms - to be displayed filters with map (Active filters: color,gender,category,etc.)
         filterIsLoading        : false,                       // When filter was checked/unchecked, display loading products filter
         selectedProducts       : props.selectedProductsProps, // Returned component products
         totalSelProducts       : props.totalSelProducts,      // Used when filters are on as a total products (Displayed: 3 of 25 products (totalSel))
         propsPathName          : " "+props.pathName,          // 
         searchResulted         : this.props.searchResulted,   // If returns true, searchProducts component is rendered

         // Those, are used to filter products
         passingTags            : {
                    category    : { men       : false, women: false, children: false },
                    subcategory : { boys      : false, girls: false, unisex: false },
                    price       : { lowHigh   : false, highLow: false },
                    newer       : { newer     : false                 },
                    color       : { white     : false, black: false, brown: false, yellow: false, pink: false, purple: false, red: false, green: false, silver: false, gray: false, gold: false, orange: false, navy: false, khaki: false, lightgreen: false, coral: false, fuchsia: false },
                    gender      : { girl      : false, boy: false },
                    material    : { cotton    : false, polyester: false, organic: false },
                    size        : { XS        : false, S: false, M: false, L: false, XL: false, XXL: false, '3XL': false },
                    necktype    : { roundneck : false, withcollar: false, vneck: false, hooded: false},
                    print       : { messsage  : false, graphic: false},
                    priceValue  : {'0to35': false, '35to65': false, '65to100': false, '200plus': false}
                },
         collectedTrueKeys      : null
      }
}
 



componentDidMount() {
  // Use this to restyle page on mobile/normal size
  window.addEventListener('resize', () => this.handleWindowResize());
  // Use this to recheck active filters panel inputs. Leaving the page cause unchecking all filters inputs.
  this.recheckCheckboxFilterInputs();
}



recheckCheckboxFilterInputs() {
   // When page is mounted, check if previous filters length is higher that the state filters length
      // Filters boxes are unchecked when page unmounts; So, this helps to recheck active filters when user leaves the products main page 
    if(this.props.propsFilteredTerms.length > this.state.filteredTerms.length) {
      // Set new state if filtered terms props is higher than the actual state to be used on displaying filtered products
      this.setState({ passingTags: this.props.propsPassingTags, filteredTerms: this.props.propsFilteredTerms })
      
      // Use this props to comunicate filters through components while new components are rendered. Maintain same filter results;
      setTimeout(() => {
      this.props.setPassingTags({ propsPassingTags: this.state.passingTags })
      this.props.setFilteredTerms({ propsFilteredTerms: this.state.filteredTerms})
      },500);

        // Select all filters checkboxes
        let checkboxes           = document.querySelectorAll('.dprod_filter_label');
         // Map through active filtered props terms and create an array with the romanian words filters
         let collectedFilterTerms = this.props.propsFilteredTerms.map((el) => el.filPropRoValue); 
         // Map through all filters checkboxes input
         checkboxes.forEach((checkbox) => {
            // If collected active filter terms contains checkbox input name and checkbox !== undefined, check it.
           if(collectedFilterTerms.includes(checkbox.childNodes[1].firstChild.innerHTML)) {
               if(checkbox.childNodes !== undefined) {
                  checkbox.childNodes[0].checked = true;
               }
              
           }
        })
    }
}

displayProductFilterNumber(e,type) {
  // Check which product contains multiple colors and return colors length
    // to be displayed along with the filter name colors
  let products = this.state.selectedProducts,
      n        = 0;


  // Return total category products number 
  if(type === 'category') {
     for(let c in products) {
        if(products[c].category === e) {
          n++;
        }
    }
    return n > 0 ? '('+n+')' : '';
   // Return total colors products number
  } else if(type === 'color') {
      for(let c in products) {
      for(let z in products[c].colors) {
        if(products[c].colors[z] === e) {
          n++;
        }
      }
    }
    return n > 0 ? '('+n+')' : '';
    // Return total size products number
  } else if(type === 'size') {
     for(let c in products) {
      for(let z in products[c].size) {
        if(products[c].size[z] === e) {
          n++;
        }
      }
    }
    return n > 0 ? '('+n+')' : '';
    // Return total material products number
  } else if(type === 'material') {
    for(let c in products) {
      for(let z in products[c].size) {
        if(products[c].material[z] === e) {
          n++;
        }
      }
    }
    return n > 0 ? '('+n+')' : '';
    // Return total necktype products number
  } else if(type === 'necktype') {
    for(let c in products) {
      for(let z in products[c].necktype) {
        if(products[c].necktype[z] === e) {
          n++;
        }
      }
    }
    return n > 0 ? '('+n+')' : '';
    // Return total print products number
  } else if(type === 'print') {
    for(let c in products) {
        if(products[c].print === e) {
          n++;
        }
    }
    return n > 0 ? '('+n+')' : '';
    // Return total subcategory products number
  } else if(type === 'subcategory') {
    for(let c in products) {
        if(products[c].subcategory === e) {
          n++;
        }
    }
    return n > 0 ? '('+n+')' : '';
  } 

}

setFilter(value, filterProp, roValueName) {
    let filteredTerms = [...this.state.filteredTerms];

    // Check if selected filter already exists inside filteredTerms
    const alreadyIncluded = filteredTerms.some((el) => el.filPropValue === value);
    // If already exists, delete it
    if(alreadyIncluded) {
      let removeExisting = filteredTerms.filter((el) => el.filPropValue !== value);
          filteredTerms  = removeExisting;
    } else {
    // Else, create new object with "filProp" as filter title and "filPropValue" as value
    // FilProp = english word type = '.blue/xs/withcollar';
    // FilPropValue = 'color/paint/size'; 
    // FillPropRoValue = romanian word type => to be displayed on active search filters
      let newFilObj                   = {};
          newFilObj["filProp"]        = filterProp;
          newFilObj["filPropValue"]   = value;
          newFilObj["filPropRoValue"] = roValueName;
          filteredTerms.push(newFilObj);
    }
    // Enable filters (set to true) clicked filter
    this.setState( prevState => ({
      // Display loading products filter effect
      filterIsLoading: true,
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
     // Keep filtered terms and passing filter tags in redux store
     // Those are used when component mount; If user come back on main page from a product info, restore checked filters
     setTimeout(() => {
      // Set with delay to leave time to update
      this.props.setFilteredTerms({ propsFilteredTerms: filteredTerms }) 
      this.props.setPassingTags({ propsPassingTags: this.state.passingTags })
      this.setState({ filterIsLoading: false })
    },700);  
}



filteredCollected = () => {
    const collectedTrueKeys = {
      category    : [],
      subcategory : [],
      colors      : [],
      material    : [],
      size        : [],
      necktype    : [],
      print       : []
    };

      // Loop through clicked boolean filters and add to collectedTrueKeys object any true value

      const { category, subcategory, color, material, size, necktype, print } = this.props.propsPassingTags;

      for (let categoryKey in category) {
        if (category[categoryKey]) collectedTrueKeys.category.push(categoryKey);
      }
      for (let subcategoryKey in subcategory) {
        if (subcategory[subcategoryKey]) collectedTrueKeys.subcategory.push(subcategoryKey);
      }
      for (let colorKey in color) {
        if (color[colorKey]) collectedTrueKeys.colors.push(colorKey);
      }
      for (let materialKey in material) {
        if (material[materialKey]) collectedTrueKeys.material.push(materialKey);
      }
      for (let sizeKey in size) {
        if (size[sizeKey]) collectedTrueKeys.size.push(sizeKey);
      }
      for (let neckTypeKey in necktype) {
        if (necktype[neckTypeKey]) collectedTrueKeys.necktype.push(neckTypeKey);
      }
      for (let printKey in print) {
        if (print[printKey]) collectedTrueKeys.print.push(printKey);
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
      const filteredProducts = this.multiPropsFilter(this.state.selectedProducts,this.filteredCollected());
      // Return product by name; If the search input is not empty, use it and see if
      // resulted product includes the input text
      return filteredProducts.filter(product => {
      // Return product name which includes value from search input
      return product.name;
      });
}


clearFilterTag(term) {
    // Remove clicked filter tag
    this.setState(prevState => ({
      // Display loading products filter effect
      filterIsLoading: true,
      // Remove filter tag from the showing list 
      filteredTerms: [...prevState.filteredTerms].filter((el) => el.filPropValue !== term.filPropValue),
      // Search inside passingTags for the 'term.filPropValue' and set it to false
         // ex: passingTags[term.filProp][term.filPropValue] = passingTags[category]['t-shirt']
      passingTags: {...prevState.passingTags,
        [term.filProp]: {...prevState.passingTags[term.filProp],
          [term.filPropValue]: !prevState.passingTags[term.filProp][term.filPropValue]
        }
      }
    }))


    // Uncheck from filter names list removed filter tag (term)
    let checkbox = document.querySelectorAll('.dprod_filter_label');
    // Map through all filter checkboxes
    for(let c in checkbox) {
      if(checkbox[c].childNodes !== undefined) {
        // Check if input checkbox label value is equal with term.filterPropRoValue
          // term.filPropRoValue === filter romanian name (ex:'galben','cu gluga','cu mesaj')
            // target label's input checkbox and uncheck it
        if(checkbox[c].childNodes[1].firstChild.innerHTML === term.filPropRoValue) {
            checkbox[c].childNodes[0].checked = false;
        }
      }
    }

    // Use this props to comunicate filters through components while new components are rendered. Maintain same filter results;
    setTimeout(() => {
    this.props.setPassingTags({ propsPassingTags: this.state.passingTags })
    this.props.setFilteredTerms({ propsFilteredTerms: this.state.filteredTerms})
    this.setState({ filterIsLoading: false })
    },500);
}



clerAllFilters() {
  let term = this.state.filteredTerms;
  // Loop through passingTags and set all filters to false
    for(let k in term) {
      this.setState(prevState => ({
        // Display loading products filter effect
        filterIsLoading: true,
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

    // Uncheck all filter inputs from panel filters
  let checkbox = document.querySelectorAll('.dprod_filter_label');
    // Map through all filter checkboxes from DOM and uncheck it all
  for(let c in checkbox) {
    if(checkbox[c].childNodes !== undefined) {
        checkbox[c].childNodes[0].checked = false;
    }
  }
  // Use this props to comunicate filters through components while new components are rendered. Maintain same filter results;
   setTimeout(() => {
    this.props.setPassingTags({ propsPassingTags: this.state.passingTags })
    this.props.setFilteredTerms({ propsFilteredTerms: this.state.filteredTerms})
    this.setState({ filterIsLoading: false })
  },500);
}

toggleDisplayFilter(e,filterTitle) {
  switch(filterTitle) {
    case 'Culoare': 
    document.querySelector('.dprodc_wfiltname_colors').classList.toggle('filter_panel_hide');
    e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'Mărime': 
    document.querySelector('.dprodc_wfiltname_size').classList.toggle('filter_panel_hide');
    e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'Material': 
    document.querySelector('.dprodc_wfiltname_material').classList.toggle('filter_panel_hide');
    e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'Pe gât': 
     document.querySelector('.dprodc_wfiltname_necktype').classList.toggle('filter_panel_hide');
     e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'Imprimeu': 
     document.querySelector('.dprodc_wfiltname_print').classList.toggle('filter_panel_hide');
     e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'prodCategory': 
     document.querySelector('.dprodc_wfiltname_prodCategory').classList.toggle('filter_panel_hide');
     e.target.classList.toggle('img_fil_arrow_active');
    break;
    case 'childrenCat': 
     document.querySelector('.dprodc_wfiltname_childcategory').classList.toggle('filter_panel_hide');
     e.target.classList.toggle('img_fil_arrow_active');
    break;
    default:
    return;
  }
} 

openMobileFilter() {
  const displayProductsCont = document.querySelector('.display_products_container'),
        filtersContainer    = document.querySelector('.d_prodcont_filters'),
        filtersWrapper      = document.querySelector('.d_prodcont_right_filterswrap'),
        body                = document.querySelector('body');
    
      // Proceed only if window with is lower than 767
      if(window.innerWidth <= 767.5) {
          if(filtersContainer.classList.contains('active_mob_filter')) {
            // Enable body scroll
            body.style.overflowY = 'auto';
            // Restore filter's container to default witdh (col-11)
            displayProductsCont.classList.remove('col-12');
            filtersWrapper.classList.remove('right_filwrap_mob_display');
            // Restore default style for filter's wrapper background
            filtersContainer.classList.remove('active_mob_filter');
        } else {
            // Disable body scroll
            body.style.overflowY = 'hidden';
            // Add mobile style for filters
            filtersContainer.classList.add('active_mob_filter');
            // Add style for filter's wrapper background
            setTimeout(() => {  filtersWrapper.classList.add('right_filwrap_mob_display'); },100);
             // Increase filter's container width 
            setTimeout(() => {  displayProductsCont.classList.add('col-12');},200);        
        }
      }
}

handleWindowResize() {

  // If window size > 767 when mobile filter style is not active anymore, remove all mobile filter style
    // to restore filters to normal style
  if(window.innerWidth > 767.5) {
     if(document.contains(document.querySelector('.display_products_container'))) {
      document.querySelector('.display_products_container').classList.remove('col-12');
      document.querySelector('.d_prodcont_filters').classList.remove('active_mob_filter');
      document.querySelector('.d_prodcont_right_filterswrap').classList.remove('right_filwrap_mob_display');
      document.querySelector('body').style.overflowY = 'auto';
   }
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

  // Get filterProp, activate filterprop and disable the rest
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


  // Use this props to comunicate filters through components while new components are rendered. Maintain same filter results;
  setTimeout(() => {
  this.props.setPassingTags({ propsPassingTags: this.state.passingTags })
  this.props.setFilteredTerms({ propsFilteredTerms: this.state.filteredTerms})
  },500);
}

sortProducts = sortArgument => {
    if (sortArgument === "lowHigh" && this.state.passingTags.price.lowHigh) {
    // Low - high sort
    this.setState({ selectedProducts: this.state.selectedProducts.sort((x, y) => x.price - y.price) })
    } else if ( sortArgument === "highLow" && this.state.passingTags.price.highLow) {
    // High - low sort
    this.setState({ selectedProducts: this.state.selectedProducts.sort( (x, y) => y.price - x.price) })
    } else if (sortArgument === 'newer' && this.state.passingTags.newer.newer) {
    // By new products
    this.setState({ selectedProducts: this.state.selectedProducts.sort((a, b) => b.new - a.new)})
    } else {
    // Default order; Order by id
    this.setState({ selectedProducts: this.state.selectedProducts.sort( (x, y) => x.pNo - y.pNo ) })
    } 
}


renderFilterColors() {

  let totalColorsList = [],
      products        = this.state.selectedProducts;

  // Collect a list with all product colors 
  for(let c in products) {
    products[c].colors.forEach(col => {
      if(!totalColorsList.includes(col)) {
        totalColorsList.push(col)
      }
    });
  }

   // Map through filterColors. If filter color word exists inside products, make it available inside filter colors list
   let colorFiltersList = this.state.filterColors.map((el,ind) => {
    if(totalColorsList.includes(el.colorEng)) {
      return ( <span className='d_prodcont_filter_box'>
          <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(el.colorEng,'color',el.colorRo)}>
            <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
            <span className='custom-control-label'>
                <span>{el.colorRo}</span>
                {/* Calculate how many products have this color and render number beside color filter name */}
                <span tabindex='-1' className='prod_fil_no'>{this.displayProductFilterNumber(el.colorEng,'color')}</span>
            </span>
          </label>
        </span>
      )}
  })
   return colorFiltersList;

}



  render() { 

    // Dispay received data to be displayed within renderproducts
    let filteredResultedProducts = this.searchProducts();
    this.props.setSelectedProducts({ selectedProducts: filteredResultedProducts })

    // Set document title
    if(!this.state.searchResulted) { 
      document.title = this.state.propsPathName+' | TDesign';
    }
    // Before displaying products, check 'Sort by' props and filter them 
    // Maintain sort by filters when rerendering
      let propsPassingTags = this.props.propsPassingTags,
          sortByName       = '';

    if(propsPassingTags.price.lowHigh) {
      filteredResultedProducts.sort((x, y) => x.price - y.price);
      sortByName = 'Preț crescător';
    } else if(propsPassingTags.price.highLow) {
      filteredResultedProducts.sort( (x, y) => y.price - x.price);
      sortByName = 'Preț descrescător';
    } else if(propsPassingTags.newer.newer) {
      filteredResultedProducts.sort((a, b) => b.new - a.new);
      sortByName = 'Cel mai nou';
    } else {
      filteredResultedProducts.sort( (x, y) => x.pNo - y.pNo );
      sortByName = '';
    }

    // Render 'Gender' filter only on 'New' and 'Search' components
    let newOrSearchComponentActive = this.state.searchResulted || this.state.propsPathName === ' Noutăți';


    return (
        <div>
          <div className='row justify-content-center'>
           <div className='products_container col-12' onClick={()=>this.handleMainContainerClick()}>

             <div className='row justify-content-center'>
                <div className='display_products_container col-11 col-md-11'>

                  {/* Products navigation */}
                  <div className='row justify-content-center'>
                    <div className='nav_path_cont nav_viewprod_path col-12'>
                     <span>
                      <Link to={'/'} className='nav_path_home'>
                        Acasă 
                        </Link>
                        /  
                        {this.state.propsPathName}
                      </span>
                    </div>    
                  </div>

                  {/* Products nav header */}
                  <div className='row justify-content-center'>
                    <div className='prod_nav_head_title col-12'>
                      <span>{this.state.propsPathName}</span>
                      <span>Rezultate: {filteredResultedProducts.length} {filteredResultedProducts.length === 1 ? 'articol' : 'articole'}</span>
                    </div>
                  </div>


                  {/* Filter and order by - Hide when mobile search dropmenu is down */}
                  {!this.props.openMobileSearch && (
                    <div className='row'>
                      <div className='head_filterorder_div col-12'>
                        <div className='row  justify-content-center'>
                          <div className='h_filter_cont h_filord_cont col-5 col-md-4'>
                            <div className='row'>
                              <div className='h_mobile_filter_button d-block d-md-none' onClick={()=>this.openMobileFilter()}>
                                {this.state.filteredTerms.length > 0 && (<span className='hmob_fil_act_no'>{this.state.filteredTerms.length}</span>)}
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
                          <div className='h_filter_results_cont d-none d-md-block h_filord_cont col-4'></div>
                          {/* Order by section */}
                          <div className='h_order_cont h_filord_cont col-7 col-md-4'>
                            <div className='row'>
                              <div className='h_orderby_button ml-auto' onClick={(e)=>this.handleOpenSortBy(e)}>
                                
                                <span className='horderby_txt'>Sortare după
                                  {/* Down arrow */}
                                  <svg className="bi bi-caret-down-fill sortby_caret_down" width="14px" height="14px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"/>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sort by dropdown */}
                      
                        {this.state.openSortByMenu && (
                        <div className='sort_by_dropdown' tabindex='0' onClick={(e) => {e.stopPropagation()}}>
                            <div className='row justify-content-center'>
                              <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('price','lowHigh','highLow')}>
                                <input type="radio" name="myfilter_radio" tabindex='0' defaultChecked={this.props.propsPassingTags.price.lowHigh ? true : false} className="sortby_prop custom-control-input"></input>
                                <div className="custom-control-label">Preț crescător </div>
                              </label>

                              <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('price','highLow','lowHigh')}>
                                <input type="radio" name="myfilter_radio" tabindex='0' defaultChecked={this.props.propsPassingTags.price.highLow ? true : false} className="sortby_prop custom-control-input"></input>
                                <div className="custom-control-label">Preț descrescător</div>
                              </label>

                              <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('newer')}>
                                <input type="radio" name="myfilter_radio" tabindex='0' defaultChecked={this.props.propsPassingTags.newer.newer ? true : false} className="sortby_prop custom-control-input"></input>
                                <div className="custom-control-label">Cel mai nou</div>
                              </label>

                              <label className="custom-control custom-radio" onChange={(e)=>this.sortBy('default')}>
                                <input type="radio" name="myfilter_radio" tabindex='0' defaultChecked={!this.props.propsPassingTags.price.lowHigh && !this.props.propsPassingTags.price.highLow && !this.props.propsPassingTags.newer.newer ? true : false} className="sortby_prop custom-control-input"></input>
                                <div className="custom-control-label">Ordine implicită</div>
                              </label>
                           </div>
                        </div>
                        )}
                      </div> {/* End of Filter and order by */}
                    </div>   
                  )}
                  

                  {/* FILTERS RIGHT PANEL */}

                  <div className='row justify-content-center'>
                    <div className='d_prodcont_filters d_prodcont_sec col-md-4 col-lg-4 col-xl-3' onClick={()=>this.openMobileFilter()}>
                      <div className='row justify-content-start justify-content-md-center '>
                        <div className='d_prodcont_right_filterswrap' onClick={(e)=>{e.stopPropagation()}}>

                        {/* Close mobile filter */}
                        <span className='mob_prodcont_filters_close'>
                            {this.state.filteredTerms.length > 0 && (
                            <span className='mob_prodcont_fil_results' onClick={()=>this.openMobileFilter()}>Aratâ produsele: {filteredResultedProducts.length}</span>
                            )}
                            <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={()=>this.openMobileFilter()}>
                              <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                              <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                            </svg>
                        </span>

                        {/* If sortBy was selected, display 'Sort by' right panel*/}
                        {sortByName.length > 0 && (
                         <div className='d_prodcont_active_filters'>
                            <span className='d_prodcont_actfil_title'>
                              <strong>Sortare după</strong>
                            </span>
                            <span className='d_pc_acfil_fil' onClick={(e) => this.sortBy('default')}>
                              <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                              </svg>
                              {sortByName}
                            </span>
                          </div>
                        )}
                        
                        {/* Display active filters */}
                        {this.state.filteredTerms.length > 0 && (
                          <div className='d_prodcont_active_filters'>
                            <span className='d_prodcont_actfil_title'>
                              <strong>Filtre active</strong>
                              <span>({this.state.filteredTerms.length})</span>
                              <span className='d_prodcont_removefilters_all' tabindex='0' title='Sterge toate filtrele' onClick={() => this.clerAllFilters()}>Sterge tot</span>
                            </span>
                            {this.state.filteredTerms.map((term,ind) =>
                            <span key={ind} className='d_pc_acfil_fil' tabindex='0' onClick={(e) => this.clearFilterTag(term)}>
                              <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                              </svg>
                              {term.filPropRoValue}
                            </span>
                            )}
                          </div>
                        )}


                        {/* Category filter panel - Display only when searchResulted is active or newProducts component is rendered (propsPathname === ' Noutati') */}
                        {newOrSearchComponentActive && (
                          <div className='d_prodcont_filter_panel'>
                            <span className='d_prodcont_filter_title'>Categorie <img src={filterArrow} tabindex='0' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'prodCategory')}/></span>
                              <div className='dprodcont_wrap_filter_names dprodc_wfiltname_prodCategory'>
                               {this.state.filterCategory.map((el,ind) =>
                                  <span className='d_prodcont_filter_box'>
                                    <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(el.catEng,'category',el.catRo)}>
                                      <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                      <span className='custom-control-label'>
                                          <span>{el.catRo}</span>
                                          <span className='prod_fil_no'>{this.displayProductFilterNumber(el.catEng,'category')}</span>
                                      </span>
                                    </label>
                                  </span>
                                )}
                              </div>
                          </div>
                        )}

                        
                        {this.state.propsPathName === ' Tricouri copii' && (
                          <div className='d_prodcont_filter_panel'>
                            <span className='d_prodcont_filter_title'>Categorie <img src={filterArrow} tabindex='0' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'childrenCat')}/></span>
                              <div className='dprodcont_wrap_filter_names dprodc_wfiltname_childcategory'>
                               {this.state.filterChildrenCategory.map((el,ind) =>
                                  <span className='d_prodcont_filter_box'>
                                    <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(el.catEng,'subcategory',el.catRo)}>
                                      <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                      <span className='custom-control-label'>
                                          <span>{el.catRo}</span>
                                          <span className='prod_fil_no'>{this.displayProductFilterNumber(el.catEng,'subcategory')}</span>
                                      </span>
                                    </label>
                                  </span>
                                )}
                              </div>
                          </div>
                          )}
                         


                          {/* Color filter panel */}
                          <div className='d_prodcont_filter_panel'>
                            <span className='d_prodcont_filter_title'>Culoare <img src={filterArrow} tabindex='0' tabindex='0' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'Culoare')}/></span>
                              <div className='dprodcont_wrap_filter_names dprodc_wfiltname_colors'>
                                {this.renderFilterColors()}
                              </div>
                          </div>

                          {/* Size filter panel */}
                          <div className='d_prodcont_filter_panel'>
                           <span className='d_prodcont_filter_title'>Mărime <img src={filterArrow} tabindex='0' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'Mărime')}/></span>
                             <div className='dprodcont_wrap_filter_names dprodc_wfiltname_size'>
                               {this.state.filterSize.map((size,ind) =>
                                  <span className='d_prodcont_filter_box'>
                                    <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(size,'size',size)}>
                                      <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                      <span className='custom-control-label'>
                                          <span>{size}</span>
                                          <span className='prod_fil_no'>{this.displayProductFilterNumber(size,'size')}</span>
                                      </span>
                                    </label>
                                  </span>
                                )}
                             </div>
                          </div>



                          {/* Material filter panel */}
                          <div className='d_prodcont_filter_panel'>
                            <span className='d_prodcont_filter_title'>Material <img src={filterArrow} tabindex='0' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'Material')}/></span>
                              <div className='dprodcont_wrap_filter_names dprodc_wfiltname_material'>
                                 {this.state.filterMaterial.map((material,ind) =>
                                    <span className='d_prodcont_filter_box'>
                                      <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(material.matEng,'material',material.matRo)}>
                                        <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                        <span className='custom-control-label'>
                                            <span>{material.matRo}</span>
                                            <span className='prod_fil_no'>{this.displayProductFilterNumber(material.matEng,'material')}</span>
                                        </span>
                                      </label>
                                    </span>
                                  )}
                               </div>
                           </div>

                          {/* Neck type filter panel */}
                           <div className='d_prodcont_filter_panel'>
                            <span className='d_prodcont_filter_title'>Pe gât <img src={filterArrow} tabindex='0' className='img_fil_arrow_active' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'Pe gât')}/></span>
                              <div className='dprodcont_wrap_filter_names dprodc_wfiltname_necktype filter_panel_hide'>
                                 {this.state.filterNeckType.map((necktype,ind) =>
                                  <span className='d_prodcont_filter_box'>
                                    <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(necktype.neckTypeEng,'necktype',necktype.neckTypeRo)}>
                                      <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                      <span className='custom-control-label'>
                                          <span>{necktype.neckTypeRo}</span>
                                          <span className='prod_fil_no'>{this.displayProductFilterNumber(necktype.neckTypeEng,'necktype')}</span>
                                      </span>
                                    </label>
                                  </span>
                                  )}
                               </div>
                           </div>

                         {/* Print filter panel */}
                           <div className='d_prodcont_filter_panel'>
                             <span className='d_prodcont_filter_title'>Imprimeu <img src={filterArrow} tabindex='0' className='img_fil_arrow_active' alt='' onClick={(e)=>this.toggleDisplayFilter(e,'Imprimeu')}/></span>
                               <div className='dprodcont_wrap_filter_names dprodc_wfiltname_print filter_panel_hide'>
                                 {this.state.filterPrint.map((print,ind) =>
                                  <span className='d_prodcont_filter_box'>
                                    <label key={ind}  className='custom-checkbox dprod_filter_label' tabindex='0' onChange={(e) => this.setFilter(print.printEng,'print',print.printRo)}>
                                      <input className='custom-control-input d_prodcont_filter_checkbox' tabindex='-1' type='checkbox'/>
                                      <span className='custom-control-label'>
                                          <span>{print.printRo}</span>
                                          <span className='prod_fil_no'>{this.displayProductFilterNumber(print.printEng,'print')}</span>
                                      </span>
                                    </label>
                                  </span>
                                  )}
                               </div>
                           </div>


                        </div>
                      </div>
                    </div>

                    {/* DISPLAY PRODUCTS CONTAINER */}

                    <div className='d_prodcont_displayproducts d_prodcont_sec col-12 col-md-8 col-lg-8 col-xl-9'>

                      {/* Loading filtered products effect only if filterd products length > 0 - Avoid displaying filter loading when there is no products to display */}
                      {this.state.filterIsLoading && filteredResultedProducts.length > 0 && (
                        <span className='d_pc_dp_load_filder_modal'></span>
                      )}

                      {/* Send data to be rendered*/}
                      <RenderProducts products={filteredResultedProducts} totalSelProducts={this.state.totalSelProducts}/>
                      
                    </div>
                  
                  </div>
                </div>
              </div>

            </div>
          </div>
      </div>
    );
  }
}


const Products = connect(mapStateToProps,mapDispatchToProps)(connectedProducts);
export default Products;

