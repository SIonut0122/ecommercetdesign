import   React             from 'react';
import   Header            from './components/Header';
import   Footer            from './components/Footer';
import Homepage            from './components/Homepage';
import ProductInfo         from './components/ProductInfo';
import menProducts         from './components/products/menProducts';
import womenProducts       from './components/products/womenProducts';
import childrenProducts    from './components/products/childrenProducts';
import newProducts         from './components/products/newProducts';
import Account             from './components/account/Account';
import MyOrders            from './components/account/MyOrders';
import ShippingData        from './components/account/ShippingData';
import Login               from './components/Login';
import PageNotFound        from './components/Pagenotfound';
import Wishlist            from './components/Wishlist';
import Cart                from './components/Cart';
import Checkout            from './components/Checkout';
import TermsAndConditions  from './components/TermsAndConditions';
import Register            from './components/Register';
import searchProducts      from './components/searchProducts';
import Contact             from './components/Contact';
import Dashboard           from './components/dashboard/Dashboard';
import addProduct          from './components/dashboard/addProduct';
import activeOrders        from './components/dashboard/activeOrders';
import './css/Main.css';
import { HashRouter, 
         Router, 
         Route, 
         Switch      }     from 'react-router-dom'; 



class Main extends React.Component {

 
  render() { 
    return (
      <HashRouter>
            <div>
               <div className='col-12'>
              
                <Header />
                
                 <div className='row justify-content-center'>
                  <div className='main_container col-12'>
                      
                   
                      <Switch>    
                        <Route  exact path='/dashboard'            component={Dashboard}          />
                        <Route  path='/dashboard/addproduct'       component={addProduct}         />
                        <Route  path='/dashboard/activeorders'     component={activeOrders}       />
                        <Route  exact path='/'                     component={Homepage}           />
                        <Route  path='/search/:id'                 component={searchProducts}     />
                        <Route  path='/productinfo/:id'            component={ProductInfo}        />
                        <Route  path='/products/men'               component={menProducts}        />
                        <Route  path='/products/women'             component={womenProducts}      />
                        <Route  path='/products/children'          component={childrenProducts}   />
                        <Route  path='/products/new'               component={newProducts}        />
                        <Route  exact path='/login'                component={Login}              />
                        <Route  exact path='/account'              component={Account}            />
                        <Route  exact path='/account/myorders'     component={MyOrders}           />
                        <Route  exact path='/account/shippingdata' component={ShippingData}       />
                        <Route  path='/register'                   component={Register}           />
                        <Route  path='/wishlist'                   component={Wishlist}           />
                        <Route  path='/cart'                       component={Cart}               />
                        <Route  path='/checkout'                   component={Checkout}           />
                        <Route  path='/contact'                    component={Contact}            />
                        <Route  path='/terms'                      component={TermsAndConditions} />
                        <Route  path=''                            component={PageNotFound}       />
                      </Switch>
                  
                  </div>
                 </div>

                <Footer />

                </div>
            </div>
        </HashRouter>
    );
  }
}


export default Main;

