import   React  from 'react';
import { Link } from 'react-router-dom'
import '../css/Main.css';


class PageNotFound extends React.Component {

	render() {
		return (
				<div>
					<div className='row justify-content-center'> 
						<div className='pagenotfound_container col-12'>
							<span className='pagenotfound_title_f'>Ups, pagina nu a fost gasită</span>
	 						<span className='pagenotfound_title_f pntfo_title_fs'>Pagina pe care încercați să o accesați este momentan indisponibilă sau a fost ștearsă.</span>
							<span className='pagenotfound_title_f pntfo_title_f404'>404</span>

							<Link to={'/'} className='cart_bottom_backbtn'>
								<svg className="bi bi-arrow-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								  <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd"/>
								  <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
								</svg>
								Înapoi la pagina principală
							</Link>
						</div>
					</div>
				</div>
		)
	}
}

export default PageNotFound;