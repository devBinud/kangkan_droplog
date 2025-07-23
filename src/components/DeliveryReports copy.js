import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

const DeliveryReports = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, 'delivery_log'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(data);
      } catch (err) {
        console.error('❌ Failed to fetch entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(entry =>
    ['name', 'product', 'phone', 'date'].some(field =>
      (entry[field] || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_#000_90%,_#b91c1c_100%)] p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center justify-center mb-6 space-y-3 text-center">
          <img src={logo} alt="Logo" className="h-20" />
          <h2 className="text-2xl font-bold text-gray-700 tracking-wide">All Delivery Reports</h2>
          <Link to="/">
            <button className="mt-2 bg-[#b91c1c] hover:bg-red-800 text-white px-6 py-2 rounded shadow-lg transition-all cursor-pointer">
              + New Delivery Entry
            </button>
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, product, phone or date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#b91c1c] border-t-transparent"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-600">No matching entries found.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm text-left border border-gray-100">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Sl. No</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Date</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Customer Name</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Product</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Price</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Phone</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium">Tracking ID</th>
                    <th className="px-4 py-3 border border-gray-100 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {paginatedEntries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border border-gray-100">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td className="px-4 py-3 border border-gray-100">{entry.date || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100">{entry.name || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100">{entry.product || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100">₹{Number(entry.price || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 border border-gray-100">{entry.phone || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100 break-all italic text-purple-700 underline">
                        {entry.link ? (
                          <a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.link}</a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 border border-gray-100 text-center space-x-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="bg-[#b91c1c] hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded"
                        >
                          View
                        </button>
                        <Link to={`/edit/${entry.id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded">
                            Edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1.5 rounded text-sm ${
                    currentPage === i + 1
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                onClick={() => setSelectedEntry(null)}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Entry Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Date:</strong> {selectedEntry.date || '-'}</p>
                <p><strong>Name:</strong> {selectedEntry.name || '-'}</p>
                <p><strong>Product:</strong> {selectedEntry.product || '-'}</p>
                <p><strong>Price:</strong> ₹{selectedEntry.price || '0'}</p>
                <p><strong>Phone:</strong> {selectedEntry.phone || '-'}</p>
                <p><strong>Address:</strong> {selectedEntry.address || '-'}</p>
                <p><strong>Tracking Link:</strong>{' '}
                  {selectedEntry.link ? (
                    <a
                      href={selectedEntry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {selectedEntry.link}
                    </a>
                  ) : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryReports;
