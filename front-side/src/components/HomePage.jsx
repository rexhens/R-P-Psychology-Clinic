import { useState, useEffect } from "react";
import Appointments from "./Appointments";
import AddAppointment from "./AddAppointment";
import './HomePage.css'
import { useNavigate } from "react-router-dom";
import { colors } from "@mui/material";

export default function HomePage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // New state for filtered clients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    const fetchClients = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert('Please log in first')
        window.location.href= '/login'
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch("https://localhost:7175/api/clients/GetAll", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        if(response.status === 401){
           window.location.href = "/login"; // Replace '/login' with your login page route
            return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(data);
        setFilteredClients(data); // Initialize filteredClients with the fetched data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    // Filter clients whenever the search term changes
    const filtered = clients.filter((client) =>
      `${client.name} ${client.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 const navigate = useNavigate();

  const handleDetailsClick = (client) => {
    // Navigate to the ClientDetails component and pass the client as state
    navigate(`/client-details`, { state: { client } });
  };


  const handleDeleteClient = async (clientId) => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
    window.location.href = '/login'
      return;
    }

    try {
      const response = await fetch(`https://localhost:7175/api/clients/Delete/${clientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading clients...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
    
      <h1>Clients</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchBar}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Client ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Surname</th>
            <th style={styles.th}>First Complaint</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td style={styles.td}>{client.brazilianId}</td>
              <td style={styles.td}>{client.name}</td>
              <td style={styles.td}>{client.surname}</td>
              <td style={styles.td}>{client.firstComplain}</td>
              <td style={styles.td}>{client.adress}</td>
              <td style={styles.td} id="buttonsCol">
                <button
                  id="deleteBtn"
                  onClick={() => handleDeleteClient(client.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
                <button id="detailsBtn" onClick={() => handleDetailsClick(client)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontSize: "16px",
    borderRadius: "15px",
    overflow: "hidden",
  },
  detailsBtn:{
    marginLeft:"200px"
  },
 
  th: {
    backgroundColor: "#808080",
    color: "white",
    padding: "12px 15px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px 12px",
    textAlign: "left",
  },
 
 searchBar: {
  marginBottom: "20px",
  padding: "10px",
  fontSize: "16px",
  maxWidth: "500px",  // Limits the width of the search bar
  width: "100%",      // Allows the bar to scale within the maxWidth
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginLeft: "auto", // Centers the search bar horizontally
  marginRight: "auto", // Centers the search bar horizontally
  color: 'black'
},

};
