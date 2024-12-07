const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white h-80 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold">Welcome to Mobile Shop</h1>
        <p className="mt-2 text-lg">Discover the best smartphones at unbeatable prices!</p>
        <button className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full transition-all">
          Shop Now
        </button>
      </div>
    </div>
  );
};
export default Banner;