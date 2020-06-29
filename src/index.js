import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import { Provider } 							  from 'react-redux';
import store  									  from './store';
import './firebase';
import newProducts from './components/products/newProducts';


ReactDOM.render(
		<Provider store={store}>
		    
			<Main />
		 
		</Provider>,
		document.getElementById('root'));
 
