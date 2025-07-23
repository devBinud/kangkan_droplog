// src/components/DeliveryReports.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const DeliveryReports = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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
        setFilteredEntries(data);
      } catch (err) {
        console.error('❌ Failed to fetch entries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = entries.filter(entry =>
      entry.name?.toLowerCase().includes(term) ||
      entry.phone?.toLowerCase().includes(term) ||
      entry.product?.toLowerCase().includes(term)
    );
    setFilteredEntries(results);
    setPage(1); // reset to page 1 on search
  }, [searchTerm, entries]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginated = filteredEntries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleEditSave = async () => {
    try {
      const ref = doc(db, 'delivery_log', editEntry.id);
      await updateDoc(ref, {
        name: editEntry.name,
        phone: editEntry.phone,
        product: editEntry.product,
        price: editEntry.price,
        address: editEntry.address,
        link: editEntry.link,
      });
      alert('Entry updated successfully!');
      setEditEntry(null);
      const updated = entries.map(e => (e.id === editEntry.id ? editEntry : e));
      setEntries(updated);
      setFilteredEntries(updated);
    } catch (err) {
      alert('❌ Failed to update entry.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_#000_90%,_#b91c1c_100%)] p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center justify-center mb-8 space-y-3 text-center">
          <img src={logo} alt="Logo" className="h-20" />
          <h2 className="text-xl font-bold text-gray-500 tracking-wide">
            All Delivery Reports
          </h2>
          <Link to="/">
            <button className="mt-2 bg-[#b91c1c] hover:bg-red-800 text-white px-6 py-2 rounded shadow-lg transition-all cursor-pointer">
              + New Delivery Entry
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto mb-6">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or product"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#b91c1c] transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#b91c1c] border-t-transparent"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-600 text-center">No entries found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left border border-gray-100">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="text-gray-500 bg-gray-30">
                  <th className="px-4 py-3 border border-gray-100">Sl. No</th>
                  <th className="px-4 py-3 border border-gray-100">Date</th>
                  <th className="px-4 py-3 border border-gray-100">Customer Name</th>
                  <th className="px-4 py-3 border border-gray-100">Product</th>
                  <th className="px-4 py-3 border border-gray-100">Price</th>
                  <th className="px-4 py-3 border border-gray-100">Phone</th>
                  <th className="px-4 py-3 border border-gray-100">Tracking ID</th>
                  <th className="px-4 py-3 border border-gray-100 text-center">Actions</th>
                </tr>

              </thead>
              <tbody className="text-gray-700">
                {paginated.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-100">{(page - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-2 border border-gray-100">{entry.date || '-'}</td>
                    <td className="px-4 py-2 border border-gray-100">{entry.name || '-'}</td>
                    <td className="px-4 py-2 border border-gray-100">{entry.product || '-'}</td>
                    <td className="px-4 py-2 border border-gray-100">₹{Number(entry.price || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 border border-gray-100">{entry.phone || '-'}</td>
                    <td className="px-4 py-2 border border-gray-100 break-all italic text-purple-700 underline">
                      {entry.link || '—'}
                    </td>

                    <td className="px-4 py-2 border border-gray-100 text-center">
                      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-1.5 rounded w-full sm:w-auto cursor-pointer"
                        >
                          View
                        </button>

                        <button
                          onClick={() => setEditEntry({ ...entry })}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded w-full sm:w-auto cursor-pointer"
                        >
                          Edit
                        </button>


                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className={`px-4 py-1.5 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-[#b91c1c] text-white hover:bg-red-800'}`}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className={`px-4 py-1.5 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-[#b91c1c] text-white hover:bg-red-800'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* VIEW POPUP BOX  */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative border border-gray-200">
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-[#b91c1c] text-2xl font-semibold"
                onClick={() => setSelectedEntry(null)}
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4 text-[#b91c1c] text-center tracking-wide">
                Entry Details
              </h3>
              <div className="space-y-3 text-sm text-gray-700 font-sans">
                <p><strong>Date:</strong> {selectedEntry.date || '-'}</p>
                <p><strong>Name:</strong> {selectedEntry.name || '-'}</p>
                <p><strong>Product:</strong> {selectedEntry.product || '-'}</p>
                <p><strong>Price:</strong> ₹{selectedEntry.price || '0'}</p>
                <p><strong>Phone:</strong> {selectedEntry.phone || '-'}</p>
                <p><strong>Address:</strong> <span className="italic text-gray-600">{selectedEntry.address || '-'}</span></p>
                <p><strong>Tracking Link:</strong> <span className="italic text-gray-500 break-all">{selectedEntry.link || '—'}</span></p>
              </div>
            </div>
          </div>
        )}



        {/* Edit Modal */}
        {editEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4 relative">
              <button className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl" onClick={() => setEditEntry(null)}>&times;</button>
              <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Entry</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <input value={editEntry.name || ''} onChange={e => setEditEntry({ ...editEntry, name: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Name" />
                <input value={editEntry.phone || ''} onChange={e => setEditEntry({ ...editEntry, phone: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Phone" />
                <input value={editEntry.product || ''} onChange={e => setEditEntry({ ...editEntry, product: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Product" />
                <input value={editEntry.price || ''} onChange={e => setEditEntry({ ...editEntry, price: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Price" />
                <input value={editEntry.address || ''} onChange={e => setEditEntry({ ...editEntry, address: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Address" />
                <input value={editEntry.link || ''} onChange={e => setEditEntry({ ...editEntry, link: e.target.value })} className="border border-gray-300 rounded px-3 py-2" placeholder="Tracking Link" />
                <button onClick={handleEditSave} className="mt-2 bg-[#b91c1c] hover:bg-red-800 text-white px-4 py-2 rounded shadow">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryReports;
