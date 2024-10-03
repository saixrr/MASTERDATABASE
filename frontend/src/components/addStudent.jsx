import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    student_name: "",
    age: null,
    gender: "",
    student_email: "",
    student_phone: "",
    college_name: "",
    location: "",
    employment: "",
    experience: null,
    field: "",
    source: "",
    passout_year: null,
    skills: [],
    activitys: [],
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [skill, setSkill] = useState("");
  const [ActivityErrors, setActivityErrors] = useState([]);
  const [hasActivitys, setHasActivitys] = useState(false);

  const handleInputChangeSkill = (event) => {
    setSkill(event.target.value);
  };

  const handleAddSkill = () => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skill],
      }));
      setSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((s) => s !== skillToDelete),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleChangeint = (e) => {
    const { name, valueAsNumber } = e.target;
    setFormData({
      ...formData,
      [name]: isNaN(valueAsNumber) ? null : valueAsNumber,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleActivityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedActivitys = [...formData.activitys];
    updatedActivitys[index][name] = value;
    setFormData({ ...formData, activitys: updatedActivitys });
    const updatedActivityErrors = [...ActivityErrors];
    updatedActivityErrors[index] = {};
    setActivityErrors(updatedActivityErrors);
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activitys: [
        ...formData.activitys,
        { title: "", description: "", date: "", tag: "" },
      ],
    });
    setActivityErrors([...ActivityErrors, {}]);
    setHasActivitys(true);
  };

  const removeActivity = (index) => {
    const updatedActivitys = formData.activitys.filter((_, i) => i !== index);
    setFormData({ ...formData, activitys: updatedActivitys });
    const updatedActivityErrors = ActivityErrors.filter((_, i) => i !== index);
    setActivityErrors(updatedActivityErrors);
    if (updatedActivitys.length === 0) {
      setHasActivitys(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student_name) newErrors.student_name = "Name is required.";
    if (formData.age != null && formData.age <= 0)
      newErrors.age = "Age must be greater than 0.";
    if (!formData.student_email) newErrors.student_email = "Email is required.";
    if (!formData.student_phone)
      newErrors.student_phone = "Phone number is required.";

    return newErrors;
  };

  const validateActivitys = () => {
    const ActivityValidationErrors = formData.activitys.map((Activity) => {
      const ActivityErrors = {};
      if (!Activity.title) ActivityErrors.title = "Activity title is required.";
      if (!Activity.description)
        ActivityErrors.description = "Activity description is required.";
      if (!Activity.date) ActivityErrors.date = "Activity date is required.";
      if (!Activity.tag) ActivityErrors.tag = "Activity tag is required.";
      return ActivityErrors;
    });

    return ActivityValidationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    const ActivityErrors = validateActivitys();
    const hasActivityErrors = ActivityErrors.some(
      (err) => Object.keys(err).length
    );

    if (Object.keys(formErrors).length > 0 || hasActivityErrors) {
      setErrors(formErrors);
      setActivityErrors(ActivityErrors);
      return;
    }

    try {
      const studentResponse = await fetch("http://localhost:5002/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: formData.student_name,
          age: formData.age,
          gender: formData.gender,
          student_email: formData.student_email,
          student_phone: formData.student_phone,
          college_name: formData.college_name,
          location: formData.location,
          employment: formData.employment,
          field: formData.field,
          source: formData.source,
          experience: formData.experience,
          skills: formData.skills,
          passout_year: formData.passout_year,
        }),
      });

      if (!studentResponse.ok) {
        throw new Error("Failed to create student");
      }

      const studentData = await studentResponse.json();

      if (formData.activitys.length > 0) {
        for (const activity of formData.activitys) {
          const activityResponse = await fetch(
            `http://localhost:5002/student/${studentData.Student.student_id}/activity`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: activity.title,
                description: activity.description,
                date: new Date(activity.date),
                tag: activity.tag,
              }),
            }
          );

          if (!activityResponse.ok) {
            throw new Error("Failed to add activity");
          }
        }
      }

      console.log("Student and activities created successfully");
      alert("Created Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Error");
    }
  };

  return (
    <div className="mt-5 py-5">
      <Link
        to="/"
        className="ml-5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Home
      </Link>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Candidate Information Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto p-8 bg-white rounded-lg border border-gray-200"
      >
        {/* Name and Email */}
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
        </div>

        {/* Phone and Age */}
        <div className="grid grid-cols-2 gap-8 mb-4">
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
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Age:
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              min={1}
              max={100}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        {/* Gender and College */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- select --
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              College Name or Workplace:
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
        </div>

        {/* Location and Year */}
        <div className="grid grid-cols-2 gap-8 mb-4">
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
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Year of Graduation:
            </label>
            <input
              type="number"
              name="passout_year"
              min={0}
              value={formData.passout_year}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passout_year && (
              <p className="text-red-500 text-sm">{errors.passout_year}</p>
            )}
          </div>
        </div>

        {/* Employment and Field */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Employment Status:
            </label>
            <select
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- select --
              </option>
              <option value="Student">Student</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
            </select>
            {errors.employment && (
              <p className="text-red-500 text-sm">{errors.employment}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Field of work or study:
            </label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.field && (
              <p className="text-red-500 text-sm">{errors.field}</p>
            )}
          </div>
        </div>

        {/* Exprience and Source */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Years of Experience:
            </label>
            <input
              type="number"
              name="experience"
              min={0}
              value={formData.experience}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Source:
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- select --
              </option>
              <option value="Meta ads">Meta ads</option>
              <option value="Landing page">Landing page</option>
              <option value="Previous Workshop">Previous Workshop</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source}</p>
            )}
          </div>
        </div>

        {/*Resume*/}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Upload Resume:
          </label>
          <input
            type="file"
            name="resume"
            // onChange={handleFileUpload}
            className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.resume && (
            <p className="text-red-500 text-sm">{errors.resume}</p>
          )}
        </div>
        {/* Skills */}
        <h2 className="font-semibold mb-4">Skills</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={skill}
            onChange={handleInputChangeSkill}
            placeholder="Enter a skill"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-green-500 text-white px-4 rounded-r-md hover:bg-green-600 transition duration-200"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5">
          {formData.skills.map((s, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span className="bg-gray-100 border px-2 py-0.5 w-full rounded-md">
                {s}
              </span>
              <button
                onClick={() => handleDeleteSkill(s)}
                className="text-red-500 px-2 rounded hover:text-red-600 transition duration-200"
              >
                <MdDelete size={20} />
              </button>
            </li>
          ))}
        </ul>

        {/* Conditional Rendering of Activitys Section */}
        {hasActivitys && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2 text-gray-700">Activitys:</h3>
            {formData.activitys.map((Activity, index) => (
              <div key={index} className="mb-2">
                <div className="border-b w-full mb-4" />
                <div className="grid grid-cols-2 gap-8 mb-2">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Activity Title:
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={Activity.title}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {ActivityErrors[index]?.title && (
                      <p className="text-red-500 text-sm">
                        {ActivityErrors[index]?.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Activity Description:
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={Activity.description}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {ActivityErrors[index]?.description && (
                      <p className="text-red-500 text-sm">
                        {ActivityErrors[index]?.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-2">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Activity Date:
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={Activity.date}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {ActivityErrors[index]?.date && (
                      <p className="text-red-500 text-sm">
                        {ActivityErrors[index]?.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Activity Tag:
                    </label>
                    <select
                      name="tag"
                      value={Activity.tag}
                      onChange={(e) => handleActivityChange(index, e)}
                      className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        -- Select --
                      </option>
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Course">Course</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Other">Other</option>
                    </select>
                    {ActivityErrors[index]?.tag && (
                      <p className="text-red-500 text-sm">
                        {ActivityErrors[index]?.tag}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right p-1">
                  {formData.activitys.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="bg-red-500 text-white py-1 px-1 rounded-md hover:bg-red-700 focus:outline-none"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Activity Button */}
        <div className="text-left">
          <button
            type="button"
            onClick={addActivity}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add Activity
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
