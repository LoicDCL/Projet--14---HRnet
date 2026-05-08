import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { format } from 'date-fns'
import { addEmployee } from '../store/employeesSlice'
import Modal from 'react-modal-lp'
import { states, departments } from '../data/data'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/modal.css'

const initialForm = {
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    startDate: null,
    street: '',
    city: '',
    state: null,
    zipCode: '',
    department: null,
}

const requiredFields = {
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    startDate: 'Start Date',
    department: 'Department',
}

const optionalFields = {
    street: 'Street',
    city: 'City',
    zipCode: 'Zip Code',
    state: 'State',
}

const getModalConfig = (form) => {
    const missingRequired = Object.entries(requiredFields)
        .filter(([key]) => !form[key])
        .map(([, label]) => label)

    if (missingRequired.length > 0) {
        return {
            type: 'error',
            title: 'Champs non remplis',
            message: `Veuillez svp remplir les champs suivants: ${missingRequired.join(', ')}.`,
        }
    }

    const missingOptional = Object.entries(optionalFields)
        .filter(([key]) => !form[key])
        .map(([, label]) => label)

    if (missingOptional.length > 0) {
        return {
            type: 'warning',
            title: 'Profil incomplet',
            message: `Profil sauvegardé mais les champs suivants sont manquants: ${missingOptional.join(', ')}.`,
        }
    }

    return {
        type: 'success',
        title: 'Profil créer!',
        message: 'Le profil à été ajouter avec succès.',
    }
}

const CreateEmployee = () => {
    const dispatch = useDispatch()
    const [form, setForm] = useState(initialForm)
    const [modalConfig, setModalConfig] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        const config = getModalConfig(form)
        setModalConfig(config)

        if (config.type !== 'error') {
            dispatch(addEmployee({
                firstName:   form.firstName,
                astName:    form.lastName,
                dateOfBirth: form.dateOfBirth ? format(form.dateOfBirth, 'MM/dd/yyyy') : '',
                startDate:   form.startDate   ? format(form.startDate,   'MM/dd/yyyy') : '',
                street:      form.street,
                city:        form.city,
                state:       form.state?.value || '',
                zipCode:     form.zipCode,
                department:  form.department?.value || '',
            }))
        }
    }

    const handleModalClose = () => {
        if (modalConfig?.type === 'success') {
            setForm(initialForm)
        }
        setModalConfig(null)
    }

    return (
        <div className="page">
            <div className="title">
                <h1>HRnet</h1>
            </div>

            <div className="container">
                <Link to="/employee-list">View Current Employees</Link>
                <h2>Create Employee</h2>

                <form id="create-employee" onSubmit={(e) => e.preventDefault()}>

                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName"
                        value={form.firstName} onChange={handleChange} />

                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName"
                        value={form.lastName} onChange={handleChange} />

                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <DatePicker
                        id="dateOfBirth"
                        selected={form.dateOfBirth}
                        onChange={(date) => setForm((prev) => ({ ...prev, dateOfBirth: date }))}
                        dateFormat="MM/dd/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={80}
                        placeholderText="MM/DD/YYYY"
                    />

                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker
                        id="startDate"
                        selected={form.startDate}
                        onChange={(date) => setForm((prev) => ({ ...prev, startDate: date }))}
                        dateFormat="MM/dd/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        placeholderText="MM/DD/YYYY"
                    />

                    <fieldset className="address">
                        <legend>Address</legend>

                        <label htmlFor="street">Street</label>
                        <input type="text" id="street" name="street"
                            value={form.street} onChange={handleChange} />

                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city"
                            value={form.city} onChange={handleChange} />

                        <label htmlFor="state">State</label>
                        <Select
                            inputId="state"
                            options={states}
                            value={form.state}
                            onChange={(option) => setForm((prev) => ({ ...prev, state: option }))}
                            placeholder="Select a state..."
                        />

                        <label htmlFor="zipCode">Zip Code</label>
                        <input type="number" id="zipCode" name="zipCode"
                            value={form.zipCode} onChange={handleChange} />
                    </fieldset>

                    <label htmlFor="department">Department</label>
                    <Select
                        inputId="department"
                        options={departments}
                        value={form.department}
                        onChange={(option) => setForm((prev) => ({ ...prev, department: option }))}
                        placeholder="Select a department..."
                    />

                </form>

                <button onClick={handleSave}>Save</button>
            </div>

            <Modal
                isOpen={!!modalConfig}
                onClose={handleModalClose}
                type={modalConfig?.type}
                title={modalConfig?.title}
            >
                <p>{modalConfig?.message}</p>
            </Modal>
        </div>
    )
}

export default CreateEmployee