import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { deleteLead, getLeadsContent } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../common/headerSlice";
import { getSellers, unblockSellers } from "../../api/sellerAPI"; // Import the new API function

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewLeadModal = () => {
    dispatch(
      openModal({
        title: "Add New Lead",
        bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openAddNewLeadModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Sellers() {
  const { leads } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const [sellers, setSellers] = useState([]); // State to store sellers
  const [selectedSellers, setSelectedSellers] = useState([]); // State to store selected sellers
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message

  useEffect(() => {
    dispatch(getLeadsContent());
    fetchSellers(); // Fetch sellers when component mounts
  }, []);

  // Function to fetch sellers from API
  const fetchSellers = async () => {
    try {
      const response = await fetch("http://localhost:5454/api/admin/sellers");
      if (!response.ok) {
        throw new Error("Failed to fetch sellers");
      }
      const data = await response.json();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (sellerId) => {
    setSelectedSellers((prevSelectedSellers) => {
      if (prevSelectedSellers.includes(sellerId)) {
        return prevSelectedSellers.filter((id) => id !== sellerId);
      } else {
        return [...prevSelectedSellers, sellerId];
      }
    });
  };

  // Function to handle block action
  const handleBlockSellers = async () => {
    try {
      // Create query string from selected seller IDs
      const queryString = selectedSellers.map((id) => `ids=${id}`).join("&");

      const response = await fetch(
        `http://localhost:5454/api/admin/block/sellers?${queryString}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to block sellers");
      }
      // Optionally handle success notification or other UI updates
      console.log("Sellers blocked successfully");
      setModalMessage("Block Completed");
      setShowModal(true);
    } catch (error) {
      console.error("Error blocking sellers:", error);
    }
  };

  // Function to handle unblock action
  const handleUnblockSellers = async () => {
    try {
      const queryString = selectedSellers.map((id) => `ids=${id}`).join("&");

      const response = await fetch(
        `http://localhost:5454/api/admin/unblock/sellers?${queryString}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Optionally handle success notification or other UI updates
      console.log("Sellers unblocked successfully");
      setModalMessage("Unblock Completed");
      setShowModal(true);
    } catch (error) {
      console.error("Error unblocking sellers:", error);
    }
  };

  // Function to check if all selected sellers have the same enabled status
  const isSameEnabledStatus = () => {
    if (selectedSellers.length === 0) return true;
    const firstSeller = sellers.find((seller) => seller.id === selectedSellers[0]);
    return selectedSellers.every((sellerId) => {
      const currentSeller = sellers.find((seller) => seller.id === sellerId);
      return currentSeller.enabled === firstSeller.enabled;
    });
  };

  // Function to check if all selected sellers are enabled
  const isAllEnabled = () => {
    return selectedSellers.every((sellerId) => {
      const currentSeller = sellers.find((seller) => seller.id === sellerId);
      return currentSeller.enabled;
    });
  };

  // Function to check if all selected sellers are disabled
  const isAllDisabled = () => {
    return selectedSellers.every((sellerId) => {
      const currentSeller = sellers.find((seller) => seller.id === sellerId);
      return !currentSeller.enabled;
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <>
      <TitleCard title="Current Sellers" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Enabled</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr key={index}>
                  <td>{seller.sellerName}</td>
                  <td>{seller.email}</td>
                  <td>{seller.phone}</td>
                  <td>{seller.enabled ? "Yes" : "No"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSellers.includes(seller.id)}
                      onChange={() => handleCheckboxChange(seller.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          {isSameEnabledStatus() && isAllEnabled() && (
            <button
              className={`btn px-6 btn-sm normal-case ${
                selectedSellers.length > 0 ? "btn-danger" : "btn-disabled"
              } mr-2`}
              onClick={handleBlockSellers}
              disabled={selectedSellers.length === 0}
            >
              Block Selected Sellers
            </button>
          )}
          {isSameEnabledStatus() && isAllDisabled() && (
            <button
              className={`btn px-6 btn-sm normal-case ${
                selectedSellers.length > 0 ? "btn-success" : "btn-disabled"
              }`}
              onClick={handleUnblockSellers}
              disabled={selectedSellers.length === 0}
            >
              Unblock Selected Sellers
            </button>
          )}
        </div>
      </TitleCard>
      {showModal && (
  <div className="fixed top-0 left-0 flex items-center justify-center z-50 h-full w-full">
    <div className="bg-white rounded-lg p-8 shadow-md">
      <p className="text-lg font-semibold mb-4">{modalMessage}</p>
      <button className="btn btn-primary" onClick={closeModal}>
        OK
      </button>
    </div>
  </div>
)}

    </>
  );
}

export default Sellers;
