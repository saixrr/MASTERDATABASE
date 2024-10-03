import React, { useState } from "react";

const AddStudent = () => {
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
    if (formData.age!=null && formData.age <= 0)
      newErrors.age = "Age must be greater than 0.";
    if (!formData.student_email) newErrors.student_email = "Email is required.";
    if (!formData.student_phone)
      newErrors.student_phone = "Phone number is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await fetch("http://localhost:5001/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        console.log(response);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("Submission successful:", data);
      } catch (error) {
        console.error("Error during submission:", error);
      }
    }
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
              Student Name*:
            </label>
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_name && (
              <p className="text-red-500 text-sm">{errors.student_name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Age:
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email*:
            </label>
            <input
              type="email"
              name="student_email"
              value={formData.student_email}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_email && (
              <p className="text-red-500 text-sm">{errors.student_email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Phone*:
            </label>
            <input
              type="tel"
              name="student_phone"
              value={formData.student_phone}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_phone && (
              <p className="text-red-500 text-sm">{errors.student_phone}</p>
            )}
          </div>
        </div>

        {/* College Info */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              College Name:
            </label>
            <input
              type="text"
              name="college_name"
              value={formData.college_name}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.college_name && (
              <p className="text-red-500 text-sm">{errors.college_name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              College Location:
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Employment and Year */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Employment:
            </label>
            <input
              type="text"
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.employment && (
              <p className="text-red-500 text-sm">{errors.employment}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Passing Year:
            </label>
            <input
              type="number"
              name="passout_year"
              value={formData.passout_year}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passout_year && (
              <p className="text-red-500 text-sm">{errors.passout_year}</p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-6 text-gray-700">Events</h3>

        {formData.events.map((event, index) => (
          <div key={index} className="mb-6 border-b pb-6">
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Event Title:
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
                  Event Tag:
                </label>
                <select
                  name="tag"
                  value={event.tag}
                  onChange={(e) => handleEventChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    --- select ---
                  </option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Event Description:
              </label>
              <textarea
                name="description"
                value={event.description}
                onChange={(e) => handleEventChange(index, e)}
                className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Event Date:
              </label>
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={(e) => handleEventChange(index, e)}
                className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeEvent(index)}
              className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-600 transition-colors"
            >
              Remove Event
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addEvent}
          className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-colors mb-6"
        >
          Add Event
        </button>

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-3 text-sm rounded-md hover:bg-green-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
