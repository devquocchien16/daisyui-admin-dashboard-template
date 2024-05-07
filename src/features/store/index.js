import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import TitleCard from "../../components/Cards/TitleCard";

function Stores() {
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeIdToUpdate, setStoreIdToUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(""); // State to store the status from API response
  const [adminReply, setAdminReply] = useState(""); // State to store the admin reply from API response

  // Function to process the store update request
  const processStoreRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5454/api/admin/${storeIdToUpdate}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: storeName }),
      });
      if (!response.ok) {
        throw new Error("Failed to process store request");
      }
      const data = await response.json();
      setStatus(data.status); // Update status from API response
      setAdminReply(data.adminReply); // Update admin reply from API response
      // Fetch stores after successful update
      fetchStores();
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Error processing store request:", error);
    }
  };

  // Function to handle the confirmation action and open the modal
  const handleConfirm = (storeId) => {
    setStoreIdToUpdate(storeId);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    // Additional logic to reset any modal-related state if needed
  };

  // Function to fetch the list of stores
  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:5454/api/admin/stores");
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  // useEffect hook to fetch stores when the component mounts
  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <>
      {/* Modal component */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Update Store Name</h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={processStoreRequest}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table of stores */}
      <TitleCard title="Current stores" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Seller Name</th>
                <th>Status</th>
                <th>Admin Reply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr key={index}>
                  <td>{store.name}</td>
                  <td>{store.sellerDTO.sellerName}</td>
                  <td>{store.status ? "Active" : "None"}</td>
                  <td>{store.status ? "None" : adminReply}</td>
                  <td>
                    {/* Button to trigger the modal */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleConfirm(store.id)}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Stores;
