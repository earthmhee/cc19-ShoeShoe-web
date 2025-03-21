import React, { useEffect, useState } from 'react';

function Beands() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        { src: '/tomm.jpg', id: 'item1' },
        { src: '/croo.jpg', id: 'item2' },
        { src: '/LINE_ALBUM_230127_1.jpg', id: 'item3' },
    ];


    useEffect(() => {
        const a = images.length
        if (a <= 1) {
            setActiveIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % a);
        }, 8000);

        return () => clearInterval(interval);
    }, [images.length]);


    return (
        <div className="flex flex-col ">

            <div className="first-div w-full mx-auto ">
                <div className="carousel w-full relative min-h-174 overflow-hidden">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            id={image.id}
                            className={`absolute carousel-item w-full h-full top-0 left-0 transition-all duration-1500 ease-in-out
      ${index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}
                        >
                            <img src={image.src} className="w-full h-full object-cover" alt={`Slide ${image.id}`} />
                        </div>
                    ))}
                </div>


                <div className="flex w-full justify-center gap-2 py-2">
                    {images.map((image, index) => (
                        <a
                            key={image.id}
                            href={`#${image.id}`}
                            className={`btn btn-xs rounded-full w-4 h-2 flex items-center justify-center transition-colors duration-300 ${activeIndex === index ? 'bg-black' : 'bg-white'}`}
                            onClick={() => setActiveIndex(index)}
                        >
                        </a>
                    ))}


                </div>
            </div>

        </div>
    )
}

export default Beands