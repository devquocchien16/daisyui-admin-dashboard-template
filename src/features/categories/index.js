import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { getLeadsContent } from "./leadSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewLeadModal = () => {
    dispatch(
      openModal({
        title: "Add New Category",
        bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={openAddNewLeadModal}
      >
        Add New
      </button>
    </div>
  );
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5454/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch Categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const renderCategoriesColumns = () => {
    const columns = [[], [], [], []];
    categories.forEach((category, index) => {
      const columnIndex = Math.floor(index / pageSize);
      columns[columnIndex].push(
        <tr key={index}>
          <td>{category.name}</td>
        </tr>
      );
    });
    return columns;
  };

  return (
    <>
      <TitleCard title="Current Categories" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {renderCategoriesColumns().map((column, index) => (
                <td key={index}>
                  <table className="table w-full">
                    <tbody>
                      {column}
                    </tbody>
                  </table>
                </td>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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

export default Categories;
