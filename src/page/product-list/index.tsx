// @ts-nocheck
import { Link } from "react-router-dom";
// import { products } from "../../constant/product";
import { useEffect, useState } from "react";
import { getProductsService } from "../../services/product";
import { toast } from "react-toastify";


const ProductListPage = () => {
  const [listProducts, setProducts] = useState([])

  const fetchProducts = async () => {
    const resp = (await getProductsService())
    if (resp.status !== 200) {
      toast("Product cannot fetch")
    }
    setProducts(resp.data?.data || [])
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {listProducts.map((product) => (
          <div
            key={product._id || product.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all border"
          >
            <img
              src={product.pictureURL}
              alt={product.name}
              className="w-full h-[222px] object-contain rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
            <Link
              to={`/products/${product._id || product.id}`}
              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
