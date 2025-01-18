import { useEffect, useState } from "react";
import './AddAppointment.css'; 

export default function CreateNewClient() {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [firstComplaint, setFirstComplaint] = useState("")
    const [adress, setAdress] = useState("")


const handleSubmit = async (e) => {
  e.preventDefault();

  
  const clientData = {
    BrazilianId: id,  // Ensure it's a number
    Name: name,
    Surname: surname,
    Amount: parseFloat(amount), // Ensure Amount is a number
  };

  console.log("Appointment Data:", appointmentData); // Log data to check

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
      alert(response.text)
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
