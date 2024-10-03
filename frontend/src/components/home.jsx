import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../App.css";
import arrow from "../assets/arrow.svg";
import search from "../assets/search.svg";

const Home = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.student_id.toLowerCase().includes(searchLower) ||
      student.student_name.toLowerCase().includes(searchLower) ||
      student.student_email.includes(searchLower) ||
      student.college_name.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle navigation to student detail
  const goToStudentDetail = (id) => {
    navigate(`student/${id}`);
  };

  return (
    <div className="App container mx-auto p-6">
      {/* Search Bar */}
      <form className="flex items-center justify-between mx-auto mb-6 px-5 gap-x-5">
        <h1 className="text-3xl ">Students Database</h1>
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-96">
          <img
            src={search}
            alt="Search Icon"
            className="absolute top-3 left-3 w-5 h-5"
          />
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" // pl-10 is used for padding to make space for the image
            placeholder="Search by ID, Name, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link
          to="/addstudent"
          className="p-2 bg-green-600 rounded-md text-white hover:bg-green-700"
        >
          Add User
        </Link>
      </form>

      {/* Table displaying student info */}
      <div className="p-3 border rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">College</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.student_id}>
                  <td className="py-2 px-4 border-b">{student.student_id}</td>
                  <td className="py-2 px-4 border-b">{student.student_name}</td>
                  <td className="py-2 px-4 border-b">
                    {student.student_email}
                  </td>
                  <td className="py-2 px-4 border-b">{student.college_name}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={arrow}
                      alt="Go to details"
                      className="cursor-pointer"
                      onClick={() => goToStudentDetail(student.student_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 border-b text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            variant="outlined"
            onChange={(event, value) => setCurrentPage(value)}
            page={currentPage}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Home;
