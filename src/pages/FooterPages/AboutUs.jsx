import React from 'react'
import { Link } from 'react-router'

function AboutUs() {
    return (
        <div className='container px-8 p-3 text-sm mb-20'>

            <div className="breadcrumbs text-sm mb-5">
                <ul>
                    <li className='text-gray-400 hover:text-black'>
                        <Link to={"/"}>HOME</Link>
                    </li>
                    <li>ABOUT US</li>
                </ul>
            </div>

            <div className='text-sm'>
                <p className='mb-5'>
                    Established in 2010, SHOESHOE started as a small SHOESHOE store provided varieties of well-selected converse models in Bangkok.
                    SHOESHOE is one of the first sneakers stores which focused on using Social Media and Online marketing.
                    Only 6 months, SHOESHOE page began to get attention among sneakerheads and converse fans, then reached 100k likes on Facebook page.
                </p>
                <p className='mb-5'>
                    Our second shoeshoe store opened its door by late 2011. The intention is to expand new product lines which are new brands such as Vans, New Balance, Nike, Onitsuka Tiger and More.
                    In 2012, we opened new branch In east side of BANGKOK  in an effort to gain more customers.
                    This store combined all well-known brands and products which sell in first two stores. With a good amount of marketing push from SHOESHOE,
                    our follower counts and likes on our brand page have grown, as well as, street-style looks has become a runway trend.
                    SHOESHOE took this opportunity. During 2012-2013, we became an authorized dealers and brought many brands into Thai streetwear market.
                    Not only footwear, we are also fascinated in Hi-street fashion brands. In Year 2014, UPPERGROUND by SHOESHOE was opened as a Multi brands store at Central World Bangkok.
                    Introducing customers to new brands and new experience are the store’s intention.
                    Upperground provide customers with Top tier sneakers from leading brands such as Nike, Adidas, Vans or Converse ,
                    together with hi-end street fashion brand from Japan such as Denim by Vanquish and fragment, Sophnet, Uniform Experiment and many more.
                </p>

                <p>
                    SHOESHOE Stocks is the best in sneakers, street wear, sportswear and a little bit of local hi-end clothing brands.
                    We have been appointed to be the launching account
                    for Nike Sportwear, Adidas Original, Van Vault and Converse First String which some of them are the exclusive products that cannot be found anywhere else in Thailand.
                    In 2015, with more than 700k follower counts and 50 employees, Carnival team is looking for a new opportunity to expand our business.
                    We are now operating new Online Store, as well as, starting our distribution business to supply sneakers and street wear products throughout nationwide.
                </p>
            </div>
        </div>
    )
}

export default AboutUs