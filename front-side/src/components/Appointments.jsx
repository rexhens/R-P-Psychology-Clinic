import { useState, useEffect } from "react";
import './Appointments.css'

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert("Please log in first!");
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
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error("Failed to load appointments");
        }
        const data = await response.json();
        console.log(data);
        setAppointments(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, []);
return (
  <div className="container mt-4">
    <h2 className="mb-4">Appointments</h2>
    {appointments.length === 0 ? (
      <p>No appointments found.</p>
    ) : (
      <div className="row">
        {appointments.map((app, index) => {
          const date = new Date(app.dateReserved);

          // Format date and start time
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Add 1 hour to the date for formattedTimeFinished
          const dateWithAddedHour = new Date(date);
          dateWithAddedHour.setHours(date.getHours() + 1);
          const formattedTimeFinished = dateWithAddedHour.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );

          return (
            <div className="col-sm-4 mb-4" key={app.id}>
              {/* Three cards per row */}
              <div className="card shadow-sm">
                <div className="card-body text-start">
                  <h5 className="card-title fw-bold">
                    Appointment Date: {formattedDate}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Hours: {formattedTime} - {formattedTimeFinished}
                  </h6>
                  <p className="card-text mb-1">
                    <span className="fw-semibold">Appointment Type:</span>{" "}
                    {app.appointemtType}
                  </p>
                  <p className="card-text mb-3">
                    <span className="fw-semibold">Appointment Amount:</span>{" "}
                    ${app.amount}
                  </p>
                  <p className="card-text mb-3">
                    <span className="fw-semibold">Client:</span>{" "}
                    {app.client.name} {app.client.surname}
                  </p>
                  <a href="#" className="btn btn-primary btn-sm detailsBtn">
                   Details
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

}
