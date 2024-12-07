
import AboutUs from "../../modules/about-us";
import Banner from "../../modules/banner";
import Categories from "../../modules/category";
import Newsletter from "../../modules/news";
import ProductList from "../../modules/product";
import Testimonials from "../../modules/testinomial";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Categories />
      <ProductList />
      <Testimonials />
      <AboutUs />
      <Newsletter />
    </div>
  );
};