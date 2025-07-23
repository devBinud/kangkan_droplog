// src/components/DeliveryEntry.js
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const DeliveryEntry = () => {
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    product: '',
    price: '',
    phone: '',
    address: '',
    link: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'delivery_log'), {
        ...formData,
        createdAt: Timestamp.now()
      });

      alert('Delivery log entry saved successfully!');
    } catch (error) {
      console.error('❌ Error adding document:', error);
      alert('❌ Failed to submit the delivery entry. Please try again.');
    }

    setFormData({
      date: '',
      name: '',
      product: '',
      price: '',
      phone: '',
      address: '',
      link: ''
    });
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_#000_90%,_#b91c1c_100%)] flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white rounded-md p-6 md:p-10 md:shadow-md border border-gray-200 md:border-none">
        <div className="flex justify-center mb-1">
          <img src={logo} alt="Logo" className="h-15 w-auto" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Droplog - Delivery Entry
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Enter product"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Customer Address</label>
            <textarea
              name="address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm resize-none focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tracking Code or Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter tracking code or link (e.g. DP0023 or https://...)"
              required
              className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#b91c1c] text-white py-3 font-semibold hover:bg-[#991b1b] transition cursor-pointer rounded-md"
          >
            Submit
          </button>

          <Link
            to="/reports"
            className="block text-center text-[#b91c1c] hover:underline font-medium cursor-pointer"
          >
            View All Delivery Reports
          </Link>
        </form>
      </div>
    </div>
  );
};

export default DeliveryEntry;
