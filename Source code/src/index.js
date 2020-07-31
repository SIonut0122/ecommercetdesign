import   React        from 'react';
import   ReactDOM     from 'react-dom';
import   Main         from './Main';
import   store        from './store';
import   newProducts  from './components/products/newProducts';
import { Provider }   from 'react-redux';
import './firebase';


ReactDOM.render(
		<Provider store={store}>
			<Main />
		</Provider>,
		document.getElementById('root'));
 
