import React, { useEffect, useState } from 'react';

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const url = 'http://localhost:8081/users';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">User Information</h1>
      <div className="max-w-screen-2xl py-12 mx-auto">
        <table className="table w-full text-base">
          <thead>
            <tr>
              <th className="py-2 border-b-2 border-gray-700">Username</th>
              <th className="py-2 border-b-2 border-gray-700">Email</th>
              <th className="py-2 border-b-2 border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.userid}>
                <td className="py-2">{user.username}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button className="update-button text-blue-500 hover:text-blue-700">
                      Update
                    </button>
                    <button className="update-button text-blue-500 hover:text-blue-700">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination flex justify-center mt-4">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map(
            (_, index) => (
              <li key={index} className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserInfo;
