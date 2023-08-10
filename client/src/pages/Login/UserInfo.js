import React, { useEffect, useState } from 'react';
import UpdateModal from '../../components/modal/updateModal';
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const url = `${baseUrl}/users`;

  const handleUpdateClick = (userid) => {
    setShowModal(true);
    setSelectedUserId(userid);
    console.log('selected user', userid);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  // useEffect(() => {
  //   const roles = JSON.parse(localStorage.getItem('roles'));
  //   console.log(roles);
  //   if (!roles) {
  //     console.log('No role, going to login');
  //     navigate('/login');
  //   } else {
  //     const isAdmin = roles.includes('admin');
  //     console.log(isAdmin);
  //     if (!isAdmin) {
  //       console.log('Redirecting to homepage');
  //       navigate('/homepage');
  //     }
  //   }
  // }, []);

  const updateUser = async () => {
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

  const handleDeleteClick = async (userid) => {
    console.log(
      "this is the userid I'm using ",
      JSON.stringify({ userid: userid })
    );
    const url = `${baseUrl}/deleteUser`;

    try {
      console.log("I'm inside the frontend try-catch!!");
      console.log(userid);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userid }),
      });
      console.log('this is the response', response);
      if (response.ok) {
        updateUser();
        alert('User deleted successfully!!');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error occurred while deleting user:', error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">User Information</h1>
      <div className="max-w-screen-2xl py-6 mx-auto">
      <div className="overflow-x-auto rounded-lg border">
        <table className="table-auto w-full bg-white">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 text-base font-bold text-gray-300">Username</th>
              <th className="py-2 px-4 text-base font-bold text-gray-300">Email</th>
              <th className="py-2 px-4 text-base font-bold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <User
                key={user.customer_id}
                user={user}
                handleUpdateClick={handleUpdateClick}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>

        {showModal && (
          <UpdateModal
            closeModal={closeModal}
            selectedUserId={selectedUserId}
            updateUser={updateUser}
          />
        )}

        {!showModal && (
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
        )}
      </div>
    </div>
  );
};

const User = ({ user, handleUpdateClick, handleDeleteClick }) => {
  return (
    <tr className="transition-colors hover:bg-blue-100">
      <td className="pl-6 py-2 text-base font-semibold">{user.username}</td>
      <td className="pl-6 py-2 text-base font-semibold">{user.email}</td>
      <td className="pl-6 py-2 text-base font-semibold">
        <div className="flex gap-2">
          <button
            className="update-button text-gray-900 hover:text-gray-500"
            onClick={() => handleUpdateClick(user.customer_id)}
          >
            <BsPencilSquare className="inline-block mr-1" />
 
          </button>
          <button
            className="update-button text-gray-900 hover:text-gray-500 pl-2"
            onClick={() => handleDeleteClick(user.customer_id)}
          >
            <BsFillTrashFill className="inline-block mr-1" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserInfo;
