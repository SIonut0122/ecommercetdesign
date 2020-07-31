import   React       from 'react';
import { Link      } from 'react-router-dom'
import '../css/Homepage.css';


class Homepage extends React.Component {


	render() {

		document.title = 'TDesign - Tricouri online';
		
		return (
				<div>
					<div className='row justify-content-center'>
						<div className='homepage_container'>

							<div className='homepage_cont_firstban'>
								<h2>Tricouri cu grafic</h2>
								<Link to={'/products/men'}>Descoperă noile colecții</Link>
							</div>

							<span className='homepage_prom_ban'>Zeci de promoții pentru clienții fideli</span>

							<div className='homepage_cont_sec_sect'>
								<div className='hompg_secsect_box'>
									<span className='hp_secsectbox_men'></span>
									<Link to={'/products/men'} className='hp_ssb_link_btn'>
										<span className='hp_ssblink_aft'><span>Bărbați</span></span>
										Bărbați
									</Link>
								</div>
								<div className='hompg_secsect_box'>
									<span className='hp_secsectbox_children'></span>
									<Link to={'/products/children'} className='hp_ssb_link_btn'>
										<span className='hp_ssblink_aft'><span>Copii</span></span>
										Copii
									</Link>
								</div>
								<div className='hompg_secsect_box'>
									<span className='hp_secsectbox_women'></span>
									<Link to={'/products/women'} className='hp_ssb_link_btn'>
										<span className='hp_ssblink_aft'><span>Femei</span></span>
										Femei
									</Link>
								</div>
							</div>


							<div className='homepage_cont_sec_third'>
								<div className='hp_csec_th_txt'>
									<h2>Descoperă noile articole</h2>
									<span>Pană la -50%</span>
									<Link to={'/products/new'}>Vezi oferte</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
		)
	}
}

export default Homepage;