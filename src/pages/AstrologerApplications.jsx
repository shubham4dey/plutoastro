import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AstrologerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch pending applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://plutoastro-backend.onrender.com/api/astrologer-applications/admin/pending"
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle Approve
  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this astrologer?")) return;
    
    try {
      const response = await axios.patch(
        `https://plutoastro-backend.onrender.com/api/astrologer-applications/approve/${id}`
      );
      toast.success(response.data.message);
      fetchApplications(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    }
  };

  // Handle Reject
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    
    try {
      const response = await axios.patch(
        `https://plutoastro-backend.onrender.com/api/astrologer-applications/reject/${id}`
      );
      toast.success(response.data.message);
      fetchApplications(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090015] flex items-center justify-center text-purple-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090015] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Astrologer Applications</h1>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="bg-[#1b0834] border border-purple-800 rounded-2xl p-10 text-center">
            <p className="text-purple-300 text-lg">No pending applications found. 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-[#1b0834] border border-purple-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all">
                {/* Image & Basic Info */}
                <div className="p-5 border-b border-purple-800/50">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={app.image || "https://via.placeholder.com/150"} 
                      alt={app.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{app.name}</h3>
                      <p className="text-purple-300 text-sm">{app.email}</p>
                      <p className="text-purple-400 text-xs">{app.phone}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Experience:</span>
                      <span className="text-white font-medium">{app.experience} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Price/min:</span>
                      <span className="text-green-400 font-bold">₹{app.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Languages:</span>
                      <span className="text-white text-right">{app.languages?.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Speciality & About */}
                <div className="p-5 border-b border-purple-800/50">
                  <h4 className="text-purple-300 font-semibold mb-2 text-sm uppercase">Speciality</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {app.speciality?.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-md border border-purple-700">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-purple-300 font-semibold mb-2 text-sm uppercase">About</h4>
                  <p className="text-purple-200 text-sm line-clamp-3">{app.about}</p>
                </div>

                {/* Action Buttons */}
                <div className="p-5 flex gap-3">
                  <button
                    onClick={() => handleApprove(app._id)}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line"></i> Approve
                  </button>
                  <button
                    onClick={() => handleReject(app._id)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-line"></i> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AstrologerApplications;