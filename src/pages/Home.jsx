import React from 'react'
import News from '../components/home-components/News';
import Beands from '../components/home-components/Beands';
import PhotoGallery from '../components/home-components/PhotoGallery';


function Home() {

	return (
		<div>
			<News />

			<PhotoGallery />
			<Beands />
		</div>
	);
}

export default Home;
