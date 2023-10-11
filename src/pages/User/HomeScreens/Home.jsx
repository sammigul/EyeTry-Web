import React, { useEffect, useState } from "react";
import API_URL from "../../../config/config";
import { useNavigate } from "react-router-dom";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
// Import rating components
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { viewAllReviews, viewProductsList } from "../../../api/productsApi";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import menSunglassesImage from '../../../assets/images/products/menSunglassesImage.jpg'
import womenSunglassesImage from '../../../assets/images/products/womenSunglassesImage.jpg'
import kidsGlasses from '../../../assets/images/products/kidsGlasses.jpg'
import menGlasses from '../../../assets/images/products/menGlasses.jpg'
import womenGlasses from '../../../assets/images/products/womenGlasses.jpg'
import shopByFace from '../../../assets/images/products/shopByFace.jpg'
import shopByStyle from '../../../assets/images/products/shopByStyle.jpg'
import glassesColor from '../../../assets/images/products/glassesColor.jpg'
import logo from '../../../assets/images/Logo/logo.png'


export default () => {

  const items = [
    {
      imageUrl: 'https://optimaxweb.glassesusa.com/image/upload/f_auto,q_auto/modern/desktopImg/PBHB_banner_medium_5a68f886c00219f93600.png',
    },
    {
      imageUrl: 'https://easysight.pk/wp-content/uploads/2022/11/web-banner-2-1-2048x778.jpg',
    },
    {
      imageUrl: 'https://optimaxweb.glassesusa.com/image/upload/f_auto,q_auto/media/wysiwyg/lp23/amazon-prime-d.png',
    },
    {
      imageUrl: 'https://optimaxweb.glassesusa.com/image/upload/f_auto,q_auto/media/wysiwyg/lp23/hp-d-martin.png',
    },
  ];

  const [productsList, setProductsList] = useState([]);
  // const [selectedColors, setSelectedColors] = useState({});
  const [productRatings, setProductRatings] = useState({}); // Store product ratings
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedColorsFeatured, setSelectedColorsFeatured] = useState({});
  const [selectedColorsNewArrivals, setSelectedColorsNewArrivals] = useState({});
  

  useEffect(() => {
    fetchProductsList();
  }, []);

  const fetchProductsList = async () => {
    try {
      const fetchedProductsList = await viewProductsList();
      setProductsList(fetchedProductsList);

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      const arrivals = fetchedProductsList.filter(product => new Date(product.createdAt) >= oneHourAgo);
      console.log('new arrivals: ' + JSON.stringify(arrivals , null, 2));
      setNewArrivals(arrivals);

      // Fetch and calculate product ratings for each product
      const productRatingsData = await Promise.all(
        fetchedProductsList.map(async (product) => {
          const response = await viewAllReviews(product._id);
          const reviews = response.data;
          const sum = reviews.reduce((total, review) => total + review.stars, 0);
          const averageRating = sum / reviews.length;
          return { productId: product._id, rating: averageRating };
        })
      );

      // Convert product ratings data to an object
      const ratingsObject = {};
      productRatingsData.forEach((item) => {
        ratingsObject[item.productId] = item.rating;
      });

      setProductRatings(ratingsObject);
    } catch (error) {
      console.error("Error fetching products list", error);
    }
  };

  const productImage = (product, color) => {
    if (
      product &&
      product.frame_information &&
      product.frame_information.frame_variants
    ) {
      const variant = product.frame_information.frame_variants.find(
        (variant) => variant.color === color
      );

      if (variant && variant.images && variant.images[0]) {
        const path = variant.images[0];
        const completePath = API_URL + path;
        return (
          <div className="">
            <img
              src={completePath}
              alt="product"
              className="object-contain w-[300px] h-[200px]"
            />
          </div>
        );
      }
    }

    // Return a placeholder or handle the case where image data is missing
    return <div className="mt-2">Image not available</div>;

  };

  const newArrivalImage = (product, color) => {
    if (
      product &&
      product.frame_information &&
      product.frame_information.frame_variants
    ) {
      const variant = product.frame_information.frame_variants.find(
        (variant) => variant.color === color
      );

      if (variant && variant.images && variant.images[0]) {
        const path = variant.images[0];
        const completePath = API_URL + path;
        return (
          <div className="">
            <img
              src={completePath}
              alt="product"
              className="object-contain w-[300px] h-[200px]"
            />
          </div>
        );
      }
    }

    // Return a placeholder or handle the case where image data is missing
    return <div className="mt-2">Image not available</div>;

  };

  // // new arrivals
  // const newArrivalImage = (product, color) => {
  //   if (
  //     product &&
  //     product.frame_information &&
  //     product.frame_information.frame_variants
  //   ) {
  //     const variant = product.frame_information.frame_variants.find(
  //       (variant) => variant.color === color
  //     );

  //     if (variant && variant.images && variant.images[0]) {
  //       const path = variant.images[0];
  //       const completePath = API_URL + path;
  //       return (
  //         <div className="">
  //           <img
  //             src={completePath}
  //             alt="product"
  //             className="object-contain w-[300px] h-[200px]"
  //           />
  //         </div>
  //       );
  //     }
  //   }

  //   // Return a placeholder or handle the case where image data is missing
  //   return <div className="mt-2">Image not available</div>;

  // };




  const sunglassesImage = (product) => {
    if (
      product
    ) {
      const variant = product.frame_information.frame_variants[0]


      if (variant && variant.images && variant.images[0]) {
        const path = variant.images[0];
        const completePath = API_URL + path;
        return (
          <div className="">
            <img
              src={completePath}
              alt="product"
              className="object-contain"
            />
          </div>
        );
      }
    }

    // Return a placeholder or handle the case where image data is missing
    return <div className="mt-2">Image not available</div>;
  };

  const navigate = useNavigate();
  const handleNavigation = (id) => {
    console.log(id)
    navigate(`/product_details/${id}`);
  };

  const handleColorSelect = (productId, color, category) => {
    if (category == "featured") {
      setSelectedColorsFeatured({
        ...selectedColorsFeatured,
        [productId]: color,
      });
    } else {
      setSelectedColorsNewArrivals({
        ...selectedColorsNewArrivals,
        [productId]: color,
      });
    }
  };
  


  return (
    <div className="bg-white flex-1">
      <Carousel>
        {items.map((item, i) => (
          <Paper key={i}>
            <img className="w-full h-[550px]" src={item.imageUrl} alt={`Image ${i + 1}`} />
          </Paper>
        ))}
      </Carousel>
      <div className="w-[80%] mx-auto">
        {/* featured products */}
        <div>
          <div>
            <h1 className="font-sans text-3xl text-gray-500 font-semibold mx-auto text-center mt-10">Featured Products</h1>
            <div class="h-1 w-full mt-2 mb-5 bg-blue-400 lg:w-1/3 mx-auto rounded-full"></div>
            <p className="font-sans text-sm mx-auto text-justify text-gray-500 font-semibold">The most excellent online eyeglasses and eyeglass frames are offered at Easy Sight, your one-stop
              online store. We offer a wide range of high-quality items because we know how important it is for
              you to access stylish and affordable eyewear. We provide options for everyone, whether you need
              prescription or non-prescription sunglasses. Finding the ideal set of eyeglasses frames that fit
              your style, personality, and budget is simple with the help of our easy-to-use website. We have
              everything you want, glasses from timelessly elegant designs to the newest techniques.</p>
          </div>

          <Splide
            className="mx-auto w-[420px] md:w-[680px] lg:w-[800px] xl:w-[100%]"
            options={{
              perPage: 4,
              gap: '2rem',
              perMove: 1,
              cover: true,
              lazyLoad: 'nearby',
              pagination: false,
              breakpoints: {
                1024: {
                  perPage: 3,
                  gap: '1rem',
                },
                768: {
                  perPage: 2,
                  gap: '.7rem',
                },
                480: {
                  perPage: 1,
                  gap: '.7rem',
                },
              },
              rewind: true,
            }}
            aria-label="My Favorite Images"
          >
            {productsList.map((product) => (
              <SplideSlide className="" key={product._id}>
                <div
                  className="items-center justify-center flex flex-col"
                >
                  <div className="" >
                    <div onClick={() => handleNavigation(product._id)} className="cursor-pointer items-center justify-center flex flex-col mx-auto">
                      {productImage(
                        product,
                        selectedColorsFeatured[product._id] ||
                        (product.frame_information &&
                          product.frame_information.frame_variants[0].color)
                      )}
                    </div>
                    {/* color palet */}
                    <div className="">
                      {product.frame_information &&
                        product.frame_information.frame_variants ? (
                        <>
                          <div className="flex mt-2">
                            {product.frame_information.frame_variants.map((variant) => (
                              <div
                                className={`border-grey rounded-full  mr-2 ${selectedColorsFeatured[product._id] === variant.color
                                  ? 'border-[2px] bg-blue-900'
                                  : ''
                                  }`}
                              >
                                <div
                                  className={`h-7 w-7 rounded-full bg-blue-800 cursor-pointer border-white border-[4px] hover:bg-blue-900`}
                                  style={{ backgroundColor: variant.color }}
                                  onClick={() => handleColorSelect(product._id, variant.color, "featured")}

                                ></div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>Color not available</p>
                        </>
                      )}
                    </div>
                    {/* Display product ratings */}
                    <div className="">
                      <div className="product-rating font-bold text-base text-yellow-500 justify-between flex mx-auto">
                        <Rating
                          name={`rating-${product._id}`}
                          value={productRatings[product._id] || 0} // Use the calculated average rating
                          readOnly
                          precision={0.1}
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        <p className="text-base">{productRatings[product._id]}</p>
                      </div>
                      <div className=" flex justify-between">
                        <div className="flex">
                          <p className="font-sans text-base" >{product.name}</p>
                          {/* discount */}
                          <p className="ml-2 font-sans text-base font-bold text-red-600" >{product.discount}% off</p>
                        </div>
                        <p className="font-sans text-lg font-semibold" >${product.priceInfo.price}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </SplideSlide>
            ))}
          </Splide>

          {/* view more button */}
          <div
            className=" mx-auto flex justify-center mt-10">
            <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-gray-700 text-gray-700 font-semibold 
                        hover:text-white border border-gray-500 hover:border-transparent ">
              <span>View All </span>
            </button>
          </div>
        </div>

        {/* categories */}
        <div>
          <div className="flex items-center justify-center mx-auto mt-10">
            <h1 className="font-sans text-3xl text-gray-500 font-semibold  text-center">Eyewear for everyone ™ </h1>
            <img src={logo} className=" ml-1 w-[50px] h-[30px]" alt="" />
          </div>
          <div class="h-1 w-full mt-2 mb-5 bg-blue-400 lg:w-[45%] mx-auto rounded-full shadow-lg"></div>
          <p className="font-sans text-sm mx-auto text-center text-gray-500 font-semibold">Get a complete pair of prescription glasses</p>
        </div>
        <div className="flex flex-col space-y-2 mx-auto mt-10">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 px-1">
              <img src={menGlasses} className="w-full h-[300px]" alt="" />

              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Men's Eyeglasses</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>

            </div>
            <div className="w-full md:w-1/3 px-1">
              <img src={womenGlasses} className="w-full h-[300px]" alt="" />
              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Women's Eyeglasses</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-1">
              <img src={kidsGlasses} className="w-full h-[300px]" alt="" />
              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Kid's Eyeglasses</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 px-1">
              <img src={glassesColor} className="w-full h-[300px]" alt="" />
              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Shop By Frame Color</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-1">
              <img src={shopByFace} className="w-full h-[300px]" alt="" />
              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Shop By Face Shape</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-1">
              <img src={shopByStyle} className="w-full h-[300px]" alt="" />
              <div className="flex items-center mt-5 mb-5 justify-between">
                <p className="font-sans text-2xl text-[#0284c7] font-semibold">Shop By Frame Shape</p>
                <div
                  className="flex">
                  <button class="py-1 px-4 rounded inline-flex items-center 
                        bg-transparent hover:bg-[#0284c7] text-[#0284c7] font-semibold 
                        hover:text-white border border-[#0284c7] hover:border-transparent ">
                    <span>Shop Now &gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>





        {/* New Arrival */}
        <div>
          <div>
            <h1 className="font-sans text-3xl text-gray-500 font-semibold mx-auto text-center mt-10">New Arrival</h1>
            <div class="h-1 w-full mt-2 mb-5 bg-blue-400 lg:w-1/3 mx-auto rounded-full shadow-lg"></div>
            <p className="font-sans text-sm mx-auto text-justify text-gray-500 font-semibold">Everyone should have access
              to high-quality eyewear, according to Easy Sight. We put a lot of effort into choosing the most fashionable and
              long-lasting eyeglass frames available. High-quality materials are used to construct our goods to guarantee
              durability and wear ability. We offer the ideal option for you, whether you need a set of glasses for regular
              usage or a special event. In addition to helping you discover the best glasses for your requirements, our team
              of professionals is always accessible to answer any questions you may have. Therefore, why wait? Experience
              the greatest online eyeglass and frame purchasing at Easy Sight right now!</p>
          </div>

          <Splide
            className="mx-auto w-[420px] md:w-[680px] lg:w-[800px] xl:w-[100%]"
            options={{
              perPage: 4,
              gap: '2rem',
              perMove: 1,
              cover: true,
              lazyLoad: 'nearby',
              pagination: false,
              breakpoints: {
                1024: {
                  perPage: 3,
                  gap: '1rem',
                },
                768: {
                  perPage: 2,
                  gap: '.7rem',
                },
                480: {
                  perPage: 1,
                  gap: '.7rem',
                },
              },
              rewind: true,
            }}
            aria-label="My Favorite Images"
          >
            {newArrivals.map((product) => (
              <SplideSlide className="" key={product._id}>
                <div
                  className="items-center justify-center flex flex-col"
                >
                  <div className="" >
                    <div onClick={() => handleNavigation(product._id)} className="cursor-pointer items-center justify-center flex flex-col mx-auto">
                      {newArrivalImage(
                        product,
                        selectedColorsNewArrivals[product._id] ||
                        (product.frame_information &&
                          product.frame_information.frame_variants[0].color)
                      )}
                    </div>

                    {/* color palet */}
                    {product.frame_information &&
                      product.frame_information.frame_variants ? (
                      <>
                        <div className="flex mt-2">
                          {product.frame_information.frame_variants.map((variant) => (
                            <div
                              className={`border-grey rounded-full  mr-2 ${selectedColorsNewArrivals[product._id] === variant.color
                                ? 'border-[2px] bg-blue-900'
                                : ''
                                }`}
                            >
                              <div
                                className={`h-7 w-7 rounded-full bg-blue-800 cursor-pointer border-white border-[4px] hover:bg-blue-900`}
                                style={{ backgroundColor: variant.color }}
                                onClick={() =>
                                  handleColorSelect(product._id, variant.color)
                                }
                              ></div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Color not available</p>
                      </>
                    )}
                    {/* Display product ratings */}
                    <div className="">
                      <div className="product-rating font-bold text-base text-yellow-500 justify-between flex mx-auto">
                        <Rating
                          name={`rating-${product._id}`}
                          value={productRatings[product._id] || 0} // Use the calculated average rating
                          readOnly
                          precision={0.1}
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        <p className="text-base">{productRatings[product._id]}</p>
                      </div>
                      <div className=" flex justify-between">
                        <p className="font-sans text-base" >{product.name}</p>
                        <p className="font-sans text-lg font-semibold" >${product.priceInfo.price}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        {/* Sunglasses & Fashion */}

        <div>
          <h1 className="font-sans text-3xl text-gray-500 font-semibold mx-auto text-center mt-10">Fashion & Prescription Sunglasses</h1>
          <div class="h-1 w-full mt-2 mb-5 bg-blue-400 lg:w-1/2 mx-auto rounded-full shadow-lg"></div>
          <p className="font-sans text-sm mx-auto  text-gray-500 font-semibold text-center">Sun rays and Style needs with and without power lens are extremely essential
            for each and every one. Enjoy all solutions at one place in an exclusive variety</p>
        </div>

        <div className="flex space-x-3 justify-center items-center mx-auto mt-10 w-[420px] md:w-[680px] lg:w-[800px] xl:w-[1200px]">
          <div className="w-[50%]">
            <img src={menSunglassesImage} className="w-full h-full" alt="" />
            <Splide
              className=""
              options={{
                perPage: 2,
                gap: '2rem',
                perMove: 1,
                cover: true,
                lazyLoad: 'nearby',
                pagination: false,
                arrows: false,
                autoplay: true, // Enable auto-play
                interval: 1500,
                breakpoints: {
                  780: {
                    perPage: 1,
                    gap: '.7rem',
                  },
                },
                rewind: true,
              }}
              aria-label="My Favorite Images"
            >
              {productsList.map((product) => (
                <SplideSlide className="" key={product._id}>
                  <div
                    className="items-center justify-center flex flex-col"
                  >
                    <div className="" >
                      <div onClick={() => handleNavigation(product._id)} className="cursor-pointer items-center justify-center flex flex-col mx-auto">
                        {productImage(
                          product,
                          selectedColorsNewArrivals[product._id] ||
                          (product.frame_information &&
                            product.frame_information.frame_variants[0].color)
                        )}
                      </div>
                      {/* color palet */}
                      {product.frame_information &&
                        product.frame_information.frame_variants ? (
                        <>
                          <div className="flex mt-2">
                            {product.frame_information.frame_variants.map((variant) => (
                              <div
                                className={`border-grey rounded-full  mr-2 ${selectedColorsNewArrivals[product._id] === variant.color
                                  ? 'border-[2px] bg-blue-900'
                                  : ''
                                  }`}
                              >
                                <div
                                  className={`h-7 w-7 rounded-full bg-blue-800 cursor-pointer border-white border-[4px] hover:bg-blue-900`}
                                  style={{ backgroundColor: variant.color }}
                                  onClick={() =>
                                    handleColorSelect(product._id, variant.color)
                                  }
                                ></div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>Color not available</p>
                        </>
                      )}
                      {/* Display product ratings */}
                      <div className="">
                        <div className="product-rating font-bold text-base text-yellow-500 justify-between flex mx-auto">
                          <Rating
                            name={`rating-${product._id}`}
                            value={productRatings[product._id] || 0} // Use the calculated average rating
                            readOnly
                            precision={0.1}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <p className="text-base">{productRatings[product._id]}</p>
                        </div>
                        <div className=" flex justify-between">
                          <div className="flex">
                            <p className="font-sans text-base" >{product.name}</p>
                            {/* discount */}
                            <p className="ml-2 font-sans text-base font-bold text-red-600" >{product.discount}% off</p>
                          </div>
                          <p className="font-sans text-lg font-semibold" >${product.priceInfo.price}</p>
                        </div>
                      </div>
                    </div>


                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>
          <div className="w-[50%]">
            <img src={womenSunglassesImage} className="w-full h-full" alt="" />
            <Splide
              className=""
              options={{
                perPage: 2,
                gap: '2rem',
                perMove: 1,
                cover: true,
                lazyLoad: 'nearby',
                pagination: false,
                arrows: false,
                autoplay: true, // Enable auto-play
                interval: 1500,
                breakpoints: {
                  780: {
                    perPage: 1,
                    gap: '.7rem',
                  },
                },
                rewind: true,
              }}
              aria-label="My Favorite Images"
            >
              {productsList.map((product) => (
                <SplideSlide className="" key={product._id}>
                  <div
                    className="items-center justify-center flex flex-col"
                  >
                    <div className="" >
                      <div onClick={() => handleNavigation(product._id)} className="cursor-pointer items-center justify-center flex flex-col mx-auto">
                        {productImage(
                          product,
                          selectedColorsNewArrivals[product._id] ||
                          (product.frame_information &&
                            product.frame_information.frame_variants[0].color)
                        )}
                      </div>
                      {/* color palet */}
                      {product.frame_information &&
                        product.frame_information.frame_variants ? (
                        <>
                          <div className="flex mt-2">
                            {product.frame_information.frame_variants.map((variant) => (
                              <div
                                className={`border-grey rounded-full  mr-2 ${selectedColorsNewArrivals[product._id] === variant.color
                                  ? 'border-[2px] bg-blue-900'
                                  : ''
                                  }`}
                              >
                                <div
                                  className={`h-7 w-7 rounded-full bg-blue-800 cursor-pointer border-white border-[4px] hover:bg-blue-900`}
                                  style={{ backgroundColor: variant.color }}
                                  onClick={() =>
                                    handleColorSelect(product._id, variant.color)
                                  }
                                ></div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p>Color not available</p>
                        </>
                      )}
                      {/* Display product ratings */}
                      <div className="">
                        <div className="product-rating font-bold text-base text-yellow-500 justify-between flex mx-auto">
                          <Rating
                            name={`rating-${product._id}`}
                            value={productRatings[product._id] || 0} // Use the calculated average rating
                            readOnly
                            precision={0.1}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <p className="text-base">{productRatings[product._id]}</p>
                        </div>
                        <div className=" flex justify-between">
                          <div className="flex">
                            <p className="font-sans text-base" >{product.name}</p>
                            {/* discount */}
                            <p className="ml-2 font-sans text-base font-bold text-red-600" >{product.discount}% off</p>
                          </div>
                          <p className="font-sans text-lg font-semibold" >${product.priceInfo.price}</p>
                        </div>
                      </div>
                    </div>


                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>

        </div>



        {/* Exclusive Features */}
        <div>

          <div>
            <h1 className="font-sans text-3xl text-gray-500 font-semibold mx-auto text-center mt-10">Enhance Your Experience With Our Outstanding Features
            </h1>
            <div class="h-1 w-full mt-2 mb-5 bg-blue-400 lg:w-[75%] mx-auto rounded-full shadow-lg"></div>
            <p className="font-sans text-sm mx-auto text-justify text-gray-500 font-semibold">Sun rays and Style needs with and without power lens are extremely essential
              for each and every one. Enjoy all solutions at one place in an exclusive variety</p>
          </div>

          <Splide
            className=""
            options={{
              // type: "loop",
              // gap: "10px",
              drag: "free",
              arrows: false,
              pagination: false,
              perPage: 2,
              autoScroll: {
                pauseOnHover: false,
                pauseOnFocus: false,

                speed: 1
              }
            }}
            extensions={{ AutoScroll }}
            aria-label="My Favorite Images"
          >
            {productsList.map((product) => (
              <SplideSlide className="" key={product._id}>
                <div
                  className="items-center justify-center flex flex-col"
                >
                  <div className="" onClick={() => handleNavigation(product._id)}>
                    <div className="cursor-pointer items-center justify-center flex flex-col mx-auto shadow-xl">
                      {sunglassesImage(
                        product
                      )}
                    </div>

                  </div>

                </div>
              </SplideSlide>
            ))}
          </Splide>

          {/* <Splide
      options={{
        type: "loop",
        gap: "10px",
        drag: "free",
        arrows: false,
        pagination: false,
        perPage: 3,
        autoScroll: {
          pauseOnHover: false,
          pauseOnFocus: false,
          rewind: false,
          speed: 1
        }
      }}
      extensions={{ AutoScroll }}
    >
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 1" />
      </SplideSlide>
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 2" />
      </SplideSlide>
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 2" />
      </SplideSlide>
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 2" />
      </SplideSlide>
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 2" />
      </SplideSlide>
      <SplideSlide>
        <img src="https://via.placeholder.com/150" alt="Image 2" />
      </SplideSlide>
    </Splide> */}
        </div>
      </div>

    </div>
  );
};
