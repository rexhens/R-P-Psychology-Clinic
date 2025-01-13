import { useEffect, useState } from "react";
import './AddAppointment.css'; // Import the custom CSS file for styling

export default function AddAppointment() {
  const [clients, setClients] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert("Please log in first.");
        return;
      }

      try {
        const response = await fetch("https://localhost:7175/api/clients/GetAll", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error(error); // Optionally handle the error
      }
    };

    fetchClients();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateTimeString = `${date}T${time}`; // Merge date and time into one string
    const dateReserved = new Date(dateTimeString); // Convert to Date object
const appointmentData = {
  ClientId: selectedClient,
  DateReserved: new Date(dateTimeString), // Merged date and time
  AppointemtType: appointmentType,
  Amount: parseFloat(amount),
};
const apiKey = localStorage.getItem("apiKey");
fetch("https://localhost:7175/api/appointments/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify(appointmentData), // Send the appointment data as JSON
});


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
        throw new Error("Failed to add appointment");
      }

      alert("Appointment added successfully");
    } catch (error) {
      console.error(error);
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
          <label htmlFor="typeLabel">Appointment Type</label>
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
      <a href="/homepage" id="backBtn">Back</a>
    </div>
  );
}
