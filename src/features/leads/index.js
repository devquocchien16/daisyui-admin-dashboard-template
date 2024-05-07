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
import { showNotification } from "../common/headerSlice"; // Import the new API function

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

function Lead() {


  const { leads } = useSelector((state) => state.lead);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Kích thước trang
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]); // State to store users
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store modal message
  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  useEffect(() => {
    dispatch(getLeadsContent());
    fetchUsers(); // Fetch users when component mounts
  }, []);

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5454/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  // Function to handle block action
  const handleBlockUsers = async () => {
    try {
      // Create query string from selected user IDs
      const queryString = selectedUsers.map((id) => `ids=${id}`).join("&");

      const response = await fetch(
        `http://localhost:5454/api/admin/block/users?${queryString}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to block users");
      }
      // Optionally handle success notification or other UI updates
      console.log("users blocked successfully");
      setModalMessage("Block Completed");
      setShowModal(true);
    } catch (error) {
      console.error("Error blocking users:", error);
    }
  };

  // Function to handle unblock action
  const handleUnblockUsers = async () => {
    try {
      const queryString = selectedUsers.map((id) => `ids=${id}`).join("&");

      const response = await fetch(
        `http://localhost:5454/api/admin/unblock/users?${queryString}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Optionally handle success notification or other UI updates
      console.log("users unblocked successfully");
      setModalMessage("Unblock Completed");
      setShowModal(true);
    } catch (error) {
      console.error("Error unblocking users:", error);
    }
  };

  // Function to check if all selected users have the same enabled status
  const isSameEnabledStatus = () => {
    if (selectedUsers.length === 0) return true;
    const firstUser = users.find((user) => user.id === selectedUsers[0]);
    return selectedUsers.every((userId) => {
      const currentUser = users.find((user) => user.id === userId);
      return currentUser.enabled === firstUser.enabled;
    });
  };

  // Function to check if all selected users are enabled
  const isAllEnabled = () => {
    return selectedUsers.every((userId) => {
      const currentUser = users.find((user) => user.id === userId);
      return currentUser.enabled;
    });
  };

  // Function to check if all selected users are disabled
  const isAllDisabled = () => {
    return selectedUsers.every((userId) => {
      const currentUser = users.find((user) => user.id === userId);
      return !currentUser.enabled;
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / pageSize); i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <TitleCard title="Current users" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enabled</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.clientName}</td>
                  <td>{user.email}</td>
                  <td>{user.enabled ? "Yes" : "No"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
      <nav className="block">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="mx-1">
              <button
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-2 rounded-md ${
                  number === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-500 hover:bg-blue-200'
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
        <div className="flex justify-end mt-4">
          {isSameEnabledStatus() && isAllEnabled() && (
            <button
              className={`btn px-6 btn-sm normal-case ${
                selectedUsers.length > 0 ? "btn-danger" : "btn-disabled"
              } mr-2`}
              onClick={handleBlockUsers}
              disabled={selectedUsers.length === 0}
            >
              Block Selected users
            </button>
          )}
          {isSameEnabledStatus() && isAllDisabled() && (
            <button
              className={`btn px-6 btn-sm normal-case ${
                selectedUsers.length > 0 ? "btn-success" : "btn-disabled"
              }`}
              onClick={handleUnblockUsers}
              disabled={selectedUsers.length === 0}
            >
              Unblock Selected Customers
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

export default Lead;
