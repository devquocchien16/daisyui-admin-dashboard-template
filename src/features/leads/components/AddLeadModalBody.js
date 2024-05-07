import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";

const INITIAL_LEAD_OBJ = {
    name: ""
};

function AddLeadModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const saveNewLead = async () => {
        if (leadObj.name.trim() === "") return setErrorMessage("Name is required!");
        else {
            try {
                const response = await fetch("http://localhost:5454/api/admin/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: leadObj.name
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to create category");
                }
                const data = await response.json();
                dispatch(showNotification({ message: "New Category Added!", status: 1 }));
                closeModal();
            } catch (error) {
                console.error("Error creating category:", error);
                setErrorMessage("Failed to create category");
            }
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLeadObj({ ...leadObj, [updateType]: value });
    };

    return (
        <>
            <InputText type="text" defaultValue={leadObj.name} updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue} />
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
