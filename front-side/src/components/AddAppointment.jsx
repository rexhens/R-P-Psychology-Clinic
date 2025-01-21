import { useEffect, useState } from "react";
import './AddAppointment.css'; // Import the custom CSS file for styling

export default function AddAppointment() {
  const [clients, setClients] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedClient, setSelectedClient] = useState(1);

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert("Please log in first.");
        window.location.href = '/login'
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
        //console.log(data)
        setClients(data);
      } catch (error) {
        
      }
    };

    fetchClients();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Ensure selectedClient is a valid number
  const clientId = parseInt(selectedClient, 10); // Convert to integer

  if (isNaN(clientId)) {
    alert("Please select a valid client.");
    return;
  }

  const dateTimeString = `${date}T${time}`;
  const dateReserved = new Date(dateTimeString);
  
  const appointmentData = {
    ClientId: clientId,  // Ensure it's a number
    DateReserved: dateReserved.toISOString(),
    AppointmentType: appointmentType,
    Amount: parseFloat(amount), // Ensure Amount is a number
  };


  try {
    const apiKey = localStorage.getItem("apiKey");
    const response = await fetch("https://localhost:7175/api/appointments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      alert("The hours are not available")
    }
    if (response.status === 200){
    alert("Appointment added successfully");

    }
  } catch (error) {
   
    alert("There was an error while adding the appointment.");
  }
};



  return (
    <div id="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dateLabel">Date of the appointment</label>
          <input
            type="date"
            name="dateInput"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeLabel">Time of the appointment</label>
          <input
            type="time"
            name="timeInput"
            id="timeInput"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="typeLabel">Appointme  nt Type</label>
          <input
            type="text"
            name="typeInput"
            id="typeInput"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientLabel">Client</label>
          <select
            name="clients"
            id="clients"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="form-control custom-select"
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.surname}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amountLabel">Amount $</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary" id="submitBtn">Submit</button>
      </form>
      <a href="/appointments" id="backBtn">Back</a>
    </div>
  );
}
