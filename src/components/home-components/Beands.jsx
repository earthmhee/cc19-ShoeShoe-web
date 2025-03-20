import React, { useEffect, useRef, useState } from 'react'
import { LeftArrowIcon, RightArrowIcon } from '../../icons';

function News() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFirstSet, setIsFirstSet] = useState(true);

    const images = [
        { src: '/Brands/popma.jpg', id: 'item1' },
        { src: '/Brands/carnival.jpg', id: 'item2' },
        { src: '/Brands/5B0639F8-930F-4502-8553-14AACDE49B1D.png', id: 'item3' },
        { src: '/Brands/ASICS-SPORTSTYLE.jpg', id: 'item4' },
        { src: '/Brands/crep.jpg', id: 'item5' },
        { src: '/Brands/PLEASURES.jpg', id: 'item6' },
        { src: '/Brands/adidasoglogo.jpg', id: 'item7' },
        { src: '/Brands/convetrse.jpg', id: 'item8' },
        { src: '/Brands/parralogo.jpg', id: 'item9' },
        { src: '/Brands/case.jpg', id: 'item10' },
        { src: '/Brands/Untitled-7.jpg', id: 'item11' },
        { src: '/Brands/puma.jpg', id: 'item12' },

    ];

    const images2 = [
        { src: '/Brands/crep.jpg', id: 'item1' },
        { src: '/Brands/PLEASURES.jpg', id: 'item2' },
        { src: '/Brands/0521F1E9-B417-47F1-B54C-5B9A7D64B98B.png', id: 'item3' },
        { src: '/Brands/THE-NORTH-FACE.jpg', id: 'item4' },
        { src: '/Brands/THISISNEVERTHAT.jpg', id: 'item5' },
        { src: '/Brands/Untitled-7.jpg', id: 'item6' },
        { src: '/Brands/puma.jpg', id: 'item7' },
        { src: '/Brands/SAUCONY.jpg', id: 'item8' },
        { src: '/Brands/TOWER-BOX.jpg', id: 'item9' },
        { src: '/Brands/9c676f828e7eee5b8ed6aed1f8c68c09.jpeg', id: 'item10' },
        { src: '/Brands/y-3_1.jpg', id: 'item11' },
    ]


    const currentImages = isFirstSet ? images : images2;
    const carouselRef = useRef(null);

    const nextSet = () => {
        setIsFirstSet((prev) => !prev);
        setActiveIndex(0);
    };

    const prevSet = () => {
        setIsFirstSet((prev) => !prev);
        setActiveIndex(0);
    };

    useEffect(() => {
        // Scroll to the active index
        if (carouselRef.current) {
            const activeElement = carouselRef.current.children[activeIndex];
            if (activeElement) {
                carouselRef.current.scrollTo({
                    left: activeElement.offsetLeft,
                    behavior: 'smooth',
                });
            }
        }
    }, [activeIndex]);

    return (
        <div className="flex flex-col items-center pr-16 pl-16 relative">

            <div className="text-center">
                <p className="text-gray-700 text-xs ">SHOP BY</p>
                <h2 className="text-black text-3xl">BRANDS</h2>
            </div>

            <div className="first-div w-full mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 overflow-x-auto whitespace-nowrap p-2" ref={carouselRef}>
                    {currentImages.map((image, index) => (
                        <div key={image.id} className="flex justify-center">
                            <img
                                src={image.src}
                                alt={`Slide ${image.id}`}
                                className="cursor-pointer w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain duration-800 hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
    
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 p-5  cursor-pointer hover:scale-125 transition-transform" onClick={prevSet}>
                    <LeftArrowIcon className="w-10 h-10 text-black" />
                </button>
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-5 cursor-pointer hover:scale-125 transition-transform" onClick={nextSet}>
                    <RightArrowIcon className="w-10 h-10 text-black" />
                </button>

        </div>
    );
}


export default News;