// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
//   const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch("http://localhost:3500/employees", {
//         credentials: "include",
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("accessToken"),
//         },
//       });
//       if (response.status === 403) return refreshAccessToken();
//       const data = await response.json();

//       return data;
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

//   const refreshAccessToken = async () => {
//     try {
//       const response = await fetch("http://localhost:8081/refresh", {
//         credentials: "include",
//       });
//       if (response.status === 403 || response.status === 401) {
//         navigate("/login");
//         localStorage.removeItem("accessToken");
//         return [];
//       }
//       const data = await response.json();
//       localStorage.setItem("accessToken", data.accessToken);
//       console.log(data);
//       return fetchEmployees();
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

  const onHandleLogout = async () => {
    try {
      await fetch("http://localhost:8081/logout", {
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-5">Home page</h1>
              {/* {employees.length
                ? employees.map((employee) => (
                    <div key={employee._id}>
                      <p>{employee.firstname + " " + employee.lastname}</p>
                    </div>
                  ))
                : null} */}
              <button className="btn btn-secondary" onClick={onHandleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
