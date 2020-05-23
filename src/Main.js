import   React from 'react';
import   Header from './components/Header';
import { connect }            from "react-redux";
import { HashRouter , Router, Route, Switch } from 'react-router-dom'; 
import './css/Main.css';

import DisplayProductsContainer from './components/DisplayProductsContainer';
import First                    from './components/First';
import Login                    from './components/Login';
import PageNotFound             from './components/Pagenotfound';
import Wishlist                 from './components/Wishlist';
import Cart                     from './components/Cart';
import Checkout                 from './components/Checkout';
import TermsAndConditions       from './components/TermsAndConditions';


import { hashHistory } from 'history'

 

const mapStateToProps = state => {
  return {  

        };
};


class connectedMain extends React.Component {


  render() { 
    return (
   <HashRouter>
        <div>
           <div className='col-12'>
          
            <Header />
             <div className='row justify-content-center'>
              <div className='main_container col-12'>
                  
               
                  <Switch>
                    <Route exact path='/' component={Checkout} />
                    <Route path='/login'    component={Login} />
                    <Route path='/wishlist' component={Wishlist} />
                    <Route path='/cart'    component={Cart} />
                    <Route path='/checkout' component={Checkout} />
                    <Route path='/terms'    component={TermsAndConditions} />
                    <Route path=""          component={PageNotFound}/>
                  </Switch>
              

              </div>
             </div>
            </div>
        </div>
      </HashRouter>
    );
  }
}


const Main = connect(mapStateToProps,null)(connectedMain);
export default Main;

