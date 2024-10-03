import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const GetStudentbyId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: "",
    age: null,
    gender: "",
    student_email: "",
    student_phone: "",
    college_name: "",
    location: "",
    employment: "",
    field: "",
    experience: null,
    source: "",
    passout_year: null,
    skills: [],
    activitys: [],
  });

  const [editFieldData, setEditFieldData] = useState({ ...formData });
  const [errors, setErrors] = useState({});
  const [skill, setSkill] = useState("");
  const [checkfirst, setCheckfirst] = useState(false);
  const [newActivities, setNewActivities] = useState([
    { title: "", description: "", date: "", tag: "" },
  ]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5002/student/${id}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setFormData(data);
        setEditFieldData(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFieldData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleChangeint = (e) => {
    const { name, value } = e.target;
    const intValue = value ? parseInt(value, 10) : 0;
    setEditFieldData((prevData) => ({
      ...prevData,
      [name]: intValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleInputChangeSkill = (e) => {
    setSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (skill.trim()) {
      setEditFieldData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skill],
      }));
      setSkill("");
    }
  };

  const handleDeleteSkill = (skillToRemove) => {
    setEditFieldData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleActivityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedActivities = [...newActivities];
    updatedActivities[index][name] = value;
    setNewActivities(updatedActivities);
  };

  const handleAddActivity = () => {
    setCheckfirst(true);
    setNewActivities([
      ...newActivities,
      { title: "", description: "", date: "", tag: "" },
    ]);
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = newActivities.filter((_, i) => i !== index);
    setNewActivities(updatedActivities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await fetch(`http://localhost:5002/student/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFieldData),
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        setFormData(data);

        for (const activity of newActivities) {
          if (
            activity.title &&
            activity.description &&
            activity.date &&
            activity.tag
          ) {
            await fetch(`http://localhost:5002/student/${id}/activity`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(activity),
            });
          }
        }

        alert("Successfully saved");
        navigate("/");
      } catch (error) {
        console.error("Error during submission:", error);
        alert("Error saving the student data and activities.");
      }
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!editFieldData.student_name)
      formErrors.student_name = "Name is required";
    if (!editFieldData.age || editFieldData.age <= 0)
      formErrors.age = "Valid age is required";
    if (!editFieldData.student_email)
      formErrors.student_email = "Email is required";
    return formErrors;
  };

  const handleDiscard = () => {
    setEditFieldData(formData);
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
        Student Information Form
      </h2>
      <form
        className="w-full max-w-3xl mx-auto p-8 bg-white rounded-lg border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Student Name and Email */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Student Name:
            </label>
            <input
              type="text"
              name="student_name"
              value={editFieldData.student_name}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_name && (
              <p className="text-red-500 text-sm">{errors.student_name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="student_email"
              value={editFieldData.student_email}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_email && (
              <p className="text-red-500 text-sm">{errors.student_email}</p>
            )}
          </div>
        </div>

        {/* Phone and Age*/}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone:
            </label>
            <input
              type="tel"
              name="student_phone"
              value={editFieldData.student_phone}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.student_phone && (
              <p className="text-red-500 text-sm">{errors.student_phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Age:
            </label>
            <input
              type="number"
              name="age"
              value={editFieldData.age}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        {/*Gender and College */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Gender:
            </label>
            <select
              name="gender"
              value={editFieldData.gender}
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              College Name:
            </label>
            <input
              type="text"
              name="college_name"
              value={editFieldData.college_name}
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location:
            </label>
            <input
              type="text"
              name="location"
              value={editFieldData.location}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Passout Year:
            </label>
            <input
              type="number"
              name="passout_year"
              value={editFieldData.passout_year}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passout_year && (
              <p className="text-red-500 text-sm">{errors.passout_year}</p>
            )}
          </div>
        </div>

        {/* Employment and field */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Employment Status:
            </label>
            <select
              name="employment"
              value={editFieldData.employment}
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
              value={editFieldData.field}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.field && (
              <p className="text-red-500 text-sm">{errors.field}</p>
            )}
          </div>
        </div>

        {/*Exprience and Source*/}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Experience:
            </label>
            <input
              type="number"
              name="experience"
              value={editFieldData.experience}
              onChange={handleChangeint}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Source:
            </label>
            <input
              type="text"
              name="source"
              value={editFieldData.source}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source}</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="p-2 border rounded-lg">
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
            {editFieldData.skills.map((s, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
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
        </div>

        {/* Existing activities */}
        <div className="my-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Activities</h3>
          {editFieldData.activitys && editFieldData.activitys.length > 0 ? (
            <ul className="space-y-4">
              {editFieldData.activitys.map((activity, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-200 rounded-md bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-800">
                      <strong>Title:</strong> {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Description:</strong> {activity.description}
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-600 text-sm font-medium px-2 py-1 rounded">
                    {activity.tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No activities available.</p>
          )}
        </div>

        {/* Add Multiple Activities Section */}
        <div className="my-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-blue-700">
            Add Activities
          </h3>
          {checkfirst &&
            newActivities.map((activity, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Activity Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={activity.title}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-1 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Activity Description:
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={activity.description}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-1 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Activity Date:
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={activity.date}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-1 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Activity Tag:
                  </label>
                  <select
                    name="tag"
                    value={activity.tag}
                    onChange={(e) => handleActivityChange(index, e)}
                    className="w-full p-1 border border-gray-300 rounded-md shadow-sm"
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
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(index)}
                  className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                >
                  Remove Activity
                </button>
              </div>
            ))}

          <button
            type="button"
            onClick={handleAddActivity}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Another Activity
          </button>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetStudentbyId;
