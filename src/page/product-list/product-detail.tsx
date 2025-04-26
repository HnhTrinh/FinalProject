// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { Carousel, Tabs } from "antd";
import { useEffect, useState } from "react";
import { productAPI } from "../../services/api";
import { toast } from "react-toastify";
import { cartAPI } from "../../services/api";
import { refreshCartCount } from "../../components/NavBar";


const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAPIProduct = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getById(id || '')
      if (response.status !== 200) {
        toast('Cannot fetch product detail')
        return
      }
      setProduct(response.data.data)
    }
    catch (err) {
      console.error(err)
      toast.error('Error fetching product details')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPIProduct()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
      </div>
    );
  }

  // Sử dụng pictureURL từ API hoặc ảnh mặc định
  const productImage = product.pictureURL || 'https://via.placeholder.com/400x400?text=No+Image';

  const placeholderImages = [
    productImage,
    productImage,
    productImage,
  ];

  // const handleBuyNow = () => {
  //   navigate(`/checkout/${id}`);
  // };

  // Format feature array for display
  const formatFeatures = (features) => {
    if (!features || !Array.isArray(features) || features.length === 0) return [];

    // Handle features that contain newlines
    return features.flatMap(feature => {
      if (feature.includes('\n')) {
        return feature.split('\n').filter(f => f.trim() !== '');
      }
      return feature;
    });
  };

  // Kiểm tra và hiển thị tính năng sản phẩm
  const formattedFeatures = formatFeatures(product.feature);

  const renderFeatures = formattedFeatures.length > 0
    ? formattedFeatures.map((item, index) => (
        <li className="flex items-center gap-3" key={index}>
          <span className="text-blue-500 text-xl">✔</span>
          <span>{item}</span>
        </li>
      ))
    : <li className="flex items-center gap-3">
        <span className="text-blue-500 text-xl">✔</span>
        <span>No features available</span>
      </li>

  const handleAddToCart = async () => {
    try {
      // Lấy productId từ dữ liệu sản phẩm
      const productId = product._id || product.id;
      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      // Gọi API để thêm sản phẩm vào giỏ hàng
      const response = await cartAPI.addToCart({
        productId,
        quantity: 1
      });

      // Kiểm tra kết quả trả về từ API
      if (response.data && response.data.success) {
        toast.success("Product added to cart successfully");

        // Cập nhật số lượng sản phẩm trong giỏ hàng ở navbar
        refreshCartCount();
      } else {
        // Hiển thị thông báo lỗi từ response.data
        const errorMessage = response.data?.error || response.data?.message || "Failed to add product to cart";
        toast.error(errorMessage);
      }
    }
    catch (err) {
      console.error("Error adding to cart:", err);

      // Kiểm tra nếu lỗi có response từ server
      if (err.response) {
        const responseData = err.response.data;

        // Hiển thị thông báo lỗi từ server
        if (responseData.error) {
          toast.error(responseData.error);
        } else if (responseData.message) {
          toast.error(responseData.message);
        } else {
          toast.error(`Error (${err.response.status}): Failed to add product to cart`);
        }
      } else if (err.message) {
        // Hiển thị thông báo lỗi từ axios
        toast.error(err.message);
      } else {
        // Thông báo lỗi mặc định
        toast.error("Failed to add product to cart");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Column: Image Carousel */}
          <div className="w-full md:w-1/2">
            <Carousel autoplay>
              {placeholderImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl text-green-600 font-semibold mb-4">
              {`${(product.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
            </p>
            <p className="text-lg text-blue-600 mb-4">
              In Stock: {product.amountInStore || 0}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {product.description || `Elevate your experience with the ${product.name}. Designed to impress, built to perform.`}
            </p>

            {/* Features Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Key Features
              </h2>
              <ul className="space-y-2">
                {renderFeatures}
              </ul>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex gap-4">
              {product.amountInStore > 0 ? (
                <>
                  <button className="px-6 py-3 bg-gray-100 text-gray-800 font-bold text-lg rounded-lg hover:bg-gray-200 hover:scale-105 transform transition-all" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </>
              ) : (
                <button className="px-6 py-3 bg-gray-400 text-white font-bold text-lg rounded-lg cursor-not-allowed" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <Tabs defaultActiveKey="1" size="large">
            <Tabs.TabPane tab="Description" key="1">
              <p className="text-gray-700 leading-relaxed">
                {product.description || `The ${product.name} is a premium product that combines cutting-edge technology with a sleek design.`}
              </p>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Feature" key="2">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {formattedFeatures.length > 0 ? (
                  formattedFeatures.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))
                ) : (
                  <li>No specifications available</li>
                )}
                <li>Price: {(product.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                <li>In Stock: {product.amountInStore || 0}</li>
                {product.category && (
                  <li>
                    Category: {typeof product.category === 'object' ? product.category.name : product.category}
                  </li>
                )}
              </ul>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Reviews" key="3">
              <p className="text-gray-700">No reviews yet. Be the first to review!</p>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      {/* Sticky Footer for CTA */}
      {/* <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-4 px-6 md:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-lg text-green-600 font-semibold">
              {(product.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 transform transition-all" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetailsPage;
