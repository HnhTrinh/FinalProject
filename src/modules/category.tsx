import { categories } from "../constant/category";

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold text-center">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
