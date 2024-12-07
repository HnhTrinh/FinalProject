import React from "react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    comment: "Amazing service! I got my phone in no time.",
    image: "https://img.buzzfeed.com/buzzfeed-static/static/2015-09/8/5/enhanced/webdr06/enhanced-17747-1441704970-1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    comment: "Great prices and excellent customer support.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS96eoXsvLdoDeb8wzOuqO0PHxS3qAB-XUVmw&s",
  },
  {
    id: 3,
    name: "Mike Johnson",
    comment: "Highly recommend this shop for anyone looking for quality phones.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrDh4bEt82jNRLep8OjFj9F3A5QRhfPV5t55FcnpuiXL9zByvKRpJ5DVwERW4ebN2vu4I&usqp=CAU",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 bg-white rounded-lg shadow-lg text-center"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 mx-auto rounded-full"
              />
              <h3 className="mt-4 font-bold">{testimonial.name}</h3>
              <p className="text-gray-600 mt-2">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
