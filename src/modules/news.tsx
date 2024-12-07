const Newsletter = () => {
  return (
    <div className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6">Subscribe to our newsletter for the latest deals and updates!</p>
        <form className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg text-gray-800 w-full sm:w-1/2"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
