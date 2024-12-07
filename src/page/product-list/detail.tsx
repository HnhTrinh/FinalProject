import { useNavigate, useParams } from "react-router-dom";
import { Carousel, Tabs } from "antd";
// import { products } from "../../constant/product";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../../redux/cart";
import { RootState } from "../../store";
import { addToCartService } from "../../services/cart";
import { useEffect, useState } from "react";
import { getProductById } from "../../services/product";
import { toast } from "react-toastify";
import { IProductData } from "../../types/product.type";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userData, cart: cartData } = useSelector((state: RootState) => state)
  const [product, setProduct] = useState<IProductData>()

  const fetchAPIProduct = async () => {
    try {
      const resp = await getProductById(id || '')
      if (resp.status !== 200) {
        toast('Cannot fetch product detail')
        return
      }
      setProduct(resp.data.data)

    }
    catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchAPIProduct()
  }, [])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
      </div>
    );
  }

  const placeholderImages = [
    product.pictureURL,
    product.pictureURL,
    product.pictureURL,
  ];

  const renderFeatures = product.feature?.map((item, index) => (
    <li className="flex items-center gap-3" key={index}>
      <span className="text-blue-500 text-xl">✔</span>
      <span>{item}</span>
    </li>
  ))

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  const handleAddToCart = async () => {
    try {
      if (!userData.isAuthenticated) {
        navigate('/login');
        return;
      }

      const cartIndex = cartData.items.findIndex(cart => cart.name === product.name)
      if (cartIndex === -1) {
        dispatch(addToCart(product))
      }
      else {
        dispatch(updateQuantity({ id: cartData.items[cartIndex].id, quantity: cartData.items[cartIndex].quantity + 1 }))
      }
      await addToCartService({ userId: userData.user?.id || '', productId: product.id.toString(), quantity: 1 })

    }
    catch (err) {
      console.error(err)
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
              {`${product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Elevate your experience with the {product.name}. Designed to
              impress, built to perform.
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
              <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 hover:scale-105 transform transition-all" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-800 font-bold text-lg rounded-lg hover:bg-gray-200 hover:scale-105 transform transition-all" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <Tabs defaultActiveKey="1" size="large">
            <Tabs.TabPane tab="Description" key="1">
              <p className="text-gray-700 leading-relaxed">
                The {product.name} is a premium device that combines cutting-edge
                technology with a sleek design. Whether you're capturing memories,
                staying productive, or enjoying multimedia, this device delivers
                excellence.
              </p>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Specifications" key="2">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Display: 6.5-inch AMOLED</li>
                <li>Processor: Octa-core 3.2 GHz</li>
                <li>Battery: 5000mAh</li>
                <li>Camera: 108 MP + 12 MP + 10 MP</li>
                <li>Storage: 256GB</li>
              </ul>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Reviews" key="3">
              <p className="text-gray-700">No reviews yet. Be the first to review!</p>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      {/* Sticky Footer for CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-4 px-6 md:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-lg text-green-600 font-semibold">
              {product.price}
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 transform transition-all" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
