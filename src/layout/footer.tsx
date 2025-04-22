const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2024 Mobile Shop. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-all"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-all"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-all"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;