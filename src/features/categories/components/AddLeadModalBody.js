import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead } from "../leadSlice"

const INITIAL_LEAD_OBJ = {
    first_name : "",
    last_name : "",
    email : ""
}

function AddCategoriesModalBody({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ)
    const saveNewLead = () => {
        if(leadObj.name.trim() === "")return setErrorMessage("Name is required!")
        else if(leadObj.is.trim() === "")return setErrorMessage("Level of category is required!")
        else{
            let newLeadObj = {
                "name": leadObj.name,
                "level": leadObj.level,
            }
            dispatch(addNewLead({newLeadObj}))
            dispatch(showNotification({message : "New Categories Added!", status : 1}))
            closeModal()
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLeadObj({...leadObj, [updateType] : value})
    }

    return(
        <>
            <InputText type="text" defaultValue={leadObj.name} updateType="name" containerStyle="mt-4" labelTitle="name" updateFormValue={updateFormValue}/>
            <InputText type="text" defaultValue={leadObj.level} updateType="level" containerStyle="mt-4" labelTitle="Level" updateFormValue={updateFormValue}/>
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    )
}

export default AddCategoriesModalBody;