import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './ClientDetails.css'

export default function ClientDetails() {
  const location = useLocation();
  const { client } = location.state || {};

  if (!client) {
    return <div>Client not found</div>;
  }

  const [appointments, setAppointments] = useState([]);
  const [clientAppointments, setClientAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert("Please log in first!");
        window.location.href = "/login";
        return;
      }
      try {
        const response = await fetch(
          "https://localhost:7175/api/appointments/GetAll",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error("Failed to load appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.clientId === client.id
      );

      // Get the date range for the client appointments
      const minDate = new Date(
        Math.min(...filteredAppointments.map((appointment) => new Date(appointment.dateReserved)))
      );
      const maxDate = new Date(
        Math.max(...filteredAppointments.map((appointment) => new Date(appointment.dateReserved)))
      );

      const weeks = [];
      let currentDate = new Date(minDate);
      while (currentDate <= maxDate) {
        const weekNumber = getWeekNumber(currentDate, minDate); // Pass minDate to calculate weeks starting from that point
        if (!weeks.includes(weekNumber)) {
          weeks.push(weekNumber);
        }
        currentDate.setDate(currentDate.getDate() + 7);
      }

      // Group appointments by week
      const groupedByWeek = filteredAppointments.reduce((acc, appointment) => {
        const weekNumber = getWeekNumber(new Date(appointment.dateReserved), minDate);
        if (!acc[weekNumber]) {
          acc[weekNumber] = [];
        }
        acc[weekNumber].push(appointment);
        return acc;
      }, {});

      // Add weeks with no appointments as empty weeks
      weeks.forEach((weekNumber) => {
        if (!groupedByWeek[weekNumber]) {
          groupedByWeek[weekNumber] = [];
        }
      });

      setClientAppointments(groupedByWeek);
    }
  }, [appointments, client]);

  const getWeekNumber = (date, minDate) => {
    const startDate = minDate;
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.floor(days / 7) + 1; // Start counting weeks from 1
  };

  return (
    
    <div>
      <h1>Client Details</h1>
      <h2>
        {client.name} {client.surname}
      </h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Week</th>
            <th>Appointments</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(clientAppointments).map(([week, appointments]) => (
            <tr key={week}>
              <td>Week {week}</td>
              <td>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div key={appointment.id}>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.dateReserved).toLocaleDateString()} <br />
                    </div>
                  ))
                ) : (
                  <em>No appointments</em>
                )}
              </td>
              <td>
                $
                {appointments
                  .reduce((sum, appointment) => sum + appointment.amount, 0)
                  .toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <a className="backBtn" href="/clients">Back</a>
    </div>
    
  );
}
