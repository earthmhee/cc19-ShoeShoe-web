import React from 'react'
import News from '../components/home-components/News';
import Beands from '../components/home-components/Beands';
import PhotoGallery from '../components/home-components/PhotoGallery';
import HomeNewArrivals from '../components/home-components/HomeNewArrival';


function Home() {

	return (
		<div>
			<News />
			<HomeNewArrivals />
			<PhotoGallery />
			<Beands />
		</div>
	);
}

export default Home;
