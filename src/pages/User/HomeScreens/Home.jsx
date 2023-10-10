import React, { useEffect, useState } from "react";
import API_URL from "../../../config/config";
import { useNavigate } from "react-router-dom";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

// Import rating components
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { viewAllReviews, viewProductsList } from "../../../api/productsApi";

export default () => {
  const [productsList, setProductsList] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const [productRatings, setProductRatings] = useState({}); // Store product ratings

  useEffect(() => {
    fetchProductsList();
  }, []);

  const fetchProductsList = async () => {
    try {
      const fetchedProductsList = await viewProductsList();
      setProductsList(fetchedProductsList);

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

  const navigate = useNavigate();
  const handleNavigation = (id) => {
    console.log(id)
    navigate(`/product_details/${id}`);
  };

  const handleColorSelect = (productId, color) => {
    setSelectedColors({
      ...selectedColors,
      [productId]: color, // Store selected color for the specific product
    });
  };


  return (
    <div className="bg-white flex-1">

      <h1 className="font-sans text-3xl font-semibold mx-auto text-center mt-10">Featured Products</h1>
      <Splide
        className="w-[450px] sm:w-[500px] md:w-[80%] lg-[90%] mx-auto"
        options={{
          perPage: 4,
          gap: '2rem',
          perMove: 1,
          cover: true,
          lazyLoad: 'nearby',
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
              <div className="" onClick={() => handleNavigation(product._id)}>
              <div className="cursor-pointer items-center justify-center flex flex-col mx-auto">
                {productImage(
                  product,
                  selectedColors[product._id] ||
                  (product.frame_information &&
                    product.frame_information.frame_variants[0].color)
                )}
              </div>
              {/* Display product ratings */}
              <div className="product-rating font-bold text-base text-yellow-500 justify-between pl-5 pr-5 md:pl-10 md:pr-10 flex mx-auto">
                <Rating
                  name={`rating-${product._id}`}
                  value={productRatings[product._id] || 0} // Use the calculated average rating
                  readOnly
                  precision={0.1}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                <p className="text-base">{productRatings[product._id]}</p>
              </div>
              <div className="pl-5 pr-5 md:pl-10 md:pr-10 flex justify-between">
              <p className="font-sans text-base" >{product.name}</p>
              <p className="font-sans text-lg font-semibold" >${product.priceInfo.price}</p>
              </div>
              </div>



            {/* color palet */}
            {product.frame_information &&
              product.frame_information.frame_variants ? (
              <>
                <div className="flex mt-2">
                  {product.frame_information.frame_variants.map((variant) => (
                    <div
                      className={`border-grey rounded-full  mr-2 ${selectedColors[product._id] === variant.color
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
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};
