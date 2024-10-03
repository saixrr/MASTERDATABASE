import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPen } from "react-icons/fa"; // Import pen icon

const GetStudentbyId = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    student_name: "",
    age: null,
    student_email: "",
    student_phone: "",
    college_name: "",
    location: "",
    employment: "",
    passout_year: null,
    events: [{ title: "", description: "", date: "", tag: "" }],
  });

  const [errors, setErrors] = useState({});
  
  // State to track which fields are in edit mode
  const [editMode, setEditMode] = useState({
    student_name: false,
    age: false,
    student_email: false,
    student_phone: false,
    college_name: false,
    location: false,
    employment: false,
    passout_year: false,
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/student/${id}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleChangeint = (e) => {
    const { name, valueAsNumber } = e.target;
    setFormData({ ...formData, [name]: valueAsNumber });
    setErrors({ ...errors, [name]: "" });
  };

  const handleEventChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEvents = [...formData.events];
    updatedEvents[index][name] = value;
    setFormData({ ...formData, events: updatedEvents });
  };

  const addEvent = () => {
    setFormData({
      ...formData,
      events: [
        ...formData.events,
        { title: "", description: "", date: "", tag: "" },
      ],
    });
  };

  const removeEvent = (index) => {
    const updatedEvents = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: updatedEvents });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student_name) newErrors.student_name = "Name is required.";
    if (formData.age === null || formData.age <= 0)
      newErrors.age = "Age must be greater than 0.";
    if (!formData.student_email) newErrors.student_email = "Email is required.";
    if (!formData.student_phone)
      newErrors.student_phone = "Phone number is required.";
    if (!formData.college_name)
      newErrors.college_name = "College name is required.";
    if (!formData.location)
      newErrors.location = "College location is required.";
    if (!formData.employment)
      newErrors.employment = "Employment status is required.";
    if (!formData.passout_year || formData.passout_year.toString().length !== 4)
      newErrors.passout_year = "Passout year must be a 4-digit number.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await fetch(`http://localhost:5001/student/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log("Update successful:", data);
        // Reset edit modes after successful update
        setEditMode({
          student_name: false,
          age: false,
          student_email: false,
          student_phone: false,
          college_name: false,
          location: false,
          employment: false,
          passout_year: false,
        });
      } catch (error) {
        console.error("Error during submission:", error);
      }
    }
  };

  // Function to toggle edit mode for a field
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="mt-5 py-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Student Information Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto p-8 bg-white rounded-lg border border-gray-200"
      >
        {/* Name and Age */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Student Name:
            </label>
            {editMode.student_name ? (
              <>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("student_name")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.student_name}</span>
                <FaPen
                  onClick={() => toggleEditMode("student_name")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.student_name && (
              <p className="text-red-500 text-sm">{errors.student_name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Age:
            </label>
            {editMode.age ? (
              <>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChangeint}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("age")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.age}</span>
                <FaPen
                  onClick={() => toggleEditMode("age")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email:
            </label>
            {editMode.student_email ? (
              <>
                <input
                  type="email"
                  name="student_email"
                  value={formData.student_email}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("student_email")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.student_email}</span>
                <FaPen
                  onClick={() => toggleEditMode("student_email")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.student_email && (
              <p className="text-red-500 text-sm">{errors.student_email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Phone:
            </label>
            {editMode.student_phone ? (
              <>
                <input
                  type="tel"
                  name="student_phone"
                  value={formData.student_phone}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("student_phone")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.student_phone}</span>
                <FaPen
                  onClick={() => toggleEditMode("student_phone")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.student_phone && (
              <p className="text-red-500 text-sm">{errors.student_phone}</p>
            )}
          </div>
        </div>

        {/* College Name and Location */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              College Name:
            </label>
            {editMode.college_name ? (
              <>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("college_name")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.college_name}</span>
                <FaPen
                  onClick={() => toggleEditMode("college_name")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.college_name && (
              <p className="text-red-500 text-sm">{errors.college_name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Location:
            </label>
            {editMode.location ? (
              <>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("location")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.location}</span>
                <FaPen
                  onClick={() => toggleEditMode("location")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Employment Status and Passout Year */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Employment Status:
            </label>
            {editMode.employment ? (
              <>
                <input
                  type="text"
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("employment")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.employment}</span>
                <FaPen
                  onClick={() => toggleEditMode("employment")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.employment && (
              <p className="text-red-500 text-sm">{errors.employment}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Passout Year:
            </label>
            {editMode.passout_year ? (
              <>
                <input
                  type="number"
                  name="passout_year"
                  value={formData.passout_year}
                  onChange={handleChangeint}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => toggleEditMode("passout_year")}>
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="flex-1">{formData.passout_year}</span>
                <FaPen
                  onClick={() => toggleEditMode("passout_year")}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            )}
            {errors.passout_year && (
              <p className="text-red-500 text-sm">{errors.passout_year}</p>
            )}
          </div>
        </div>

        {/* Events Section */}
        <h3 className="text-xl font-semibold mb-4">Events:</h3>
        {formData.events.map((event, index) => (
          <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md">
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={(e) => handleEventChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Description:
                </label>
                <input
                  type="text"
                  name="description"
                  value={event.description}
                  onChange={(e) => handleEventChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  name="date"
                  value={event.date}
                  onChange={(e) => handleEventChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Tag:
                </label>
                <input
                  type="text"
                  name="tag"
                  value={event.tag}
                  onChange={(e) => handleEventChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEvent(index)}
              className="bg-red-500 text-white py-1 px-3 rounded-md"
            >
              Remove Event
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEvent}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
        >
          Add Event
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md"
        >
          Update Student
        </button>
      </form>
    </div>
  );
};

export default GetStudentbyId;
