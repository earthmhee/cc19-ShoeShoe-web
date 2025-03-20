import React from 'react';

function PhotoGallery() {
    return (
        <div className="max-w-6xl mx-auto py-10 px-4">

            {/* เส้นแบ่ง */}
            <hr className="border-t border-black mb-4" />

            {/* Layout Grid */}
            <div className="grid grid-cols-13 gap-3">

                {/* แถวที่ 1 */}
                <img
                    src="/Gallery/6a4930c81483b1c876cd8a0e939099f2.jpg"
                    alt="Model Wearing Sneakers"
                    className="col-span-7 row-span-2 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />
                <img
                    src="/Gallery/be714f27be2a0dfc9ceb4dcce4a0b8c7.jpg"
                    alt="Tower Box"
                    className="col-span-6 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />
                <img
                    src="/Gallery/44609874987c618b9aaf786d2f7bd9bd.jpg"
                    alt="Crep Protection"
                    className="col-span-3 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />
                <img
                    src="/Gallery/web-02.jpg"
                    alt="Crep Protection"
                    className="col-span-3 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />

                {/* แถวที่ 2 */}
                <img
                    src="/Gallery/47846499a7da6c91f140c4988bbb1e4e.jpg"
                    alt="Nike Red Sneakers"
                    className="col-span-6 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />
                <img
                    src="/Gallery/b0ed4dc306a6927f6709acdc16c32ce1.jpg"
                    alt="Nike Dunk Low"
                    className="col-span-7 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />


                <img
                    src="/Gallery/cnv031201.jpg"
                    alt="Streetwear Fashion"
                    className="col-span-9 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer
                    transition-all duration-500 scale-100 hover:scale-102"
                />
                <img
                    src="Gallery/d49fd39ae94d05da9a97f6874310be1b.jpg"
                    alt="Crocs Special Edition"
                    className="col-span-4 row-span-1 w-full h-full object-cover shadow-lg cursor-pointer 
               transition-all duration-500 scale-100 hover:scale-102"
                />

            </div>
        </div>
    );
}

export default PhotoGallery;
