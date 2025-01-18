import { useState, useEffect } from "react";
import './Appointments.css'
import AppDetailsModal from "./AppDetailsModal";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [filteredDate, setFilteredDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        alert("Please log in first!");
        window.location.href = '/login'
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
        console.log(data);
        setAppointments(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, []);
 const payTheBill = async (appointmentId) => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      alert("Please log in first.");
      window.location.href = '/login';
      return;
    }

    try {
      // Make a POST request with appointmentId as part of the body
      const response = await fetch("https://localhost:7175/api/appointments/payTheBill", {
        method: "POST", // Use POST to send data
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json", // Specify content type as JSON
        },
        body: JSON.stringify({ appointmentId }), // Send the appointmentId in the request body
      });

      if (response.status === 401) {
        window.location.href = "/login"; // Redirect to login page if unauthorized
        return;
      }

      if (!response.ok) {
        throw new Error(await response.text()); // Handle other response errors
      }
      alert("Appointment was paid successfully")
      window.location.href = '/appointments'
    } catch (error) {
      console.error(error); // Log any errors
      alert('An error occurred while processing the payment');
    }
  };

  useEffect(() => {
    // You can handle other side-effects here if needed.
  }, []);
  const filteredAppointments = appointments.filter((app) => {
  if (filter === "thisMonth") {
    const today = new Date();
    const appointmentDate = new Date(app.dateReserved);
    return (
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  }

  if (filter === "selectDate" && filteredDate) {
    const selected = new Date(filteredDate);
    const appointmentDate = new Date(app.dateReserved);
    return appointmentDate.toDateString() === selected.toDateString();
  }

  return true; // "all" filter or unrecognized filter
});

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Appointments</h2>
      <a href="/add" id="addAppBtn" className="btn btn-success mb-4">
        Add a new Appointment
      </a>
      <select name="filter" id="filter"  onChange={(e) => {
        setFilter(e.target.value)
        if(e.target.value === "selectDate"){
          setShowDatePicker(true)
        }else{
          setShowDatePicker(false)
        }
        }}>
        <option value="all">All</option>
        <option value="selectDate">Select a Date</option>
        <option value="thisMonth">This month</option>
      </select>
      {
       showDatePicker && <input type="date" id="datePicker"  onChange={(e) => setFilteredDate(e.target.value)}/>
      }
      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="row">
          {filteredAppointments.map((app) => {
            const date = new Date(app.dateReserved);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateWithAddedHour = new Date(date);
            dateWithAddedHour.setHours(date.getHours() + 1);
            const formattedTimeFinished = dateWithAddedHour.toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            );

            return (
              <div className="col-sm-4 mb-4" key={app.id}>
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
                     <p className="card-text mb-1">
                      <span className="fw-semibold">Appointment Status:</span>{" "}
                      <span   style={{  color: app.status === "Unpaid" ? "red" : "green", }}>{app.status}</span>
                    </p>
                    <p className="card-text mb-3">
                      <span className="fw-semibold">Appointment Amount:</span>{" "}
                      ${app.amount}
                    </p>
                    <p className="card-text mb-3">
                      <span className="fw-semibold">Client:</span>{" "}
                      {app.client.name} {app.client.surname}
                    </p>
                    <div className="btnContainer">
  <a
    href="#"
    className="btn btn-sm detailsBtn"
    onClick={() => {
      setSelectedAppointment(app);
      setShowModal(true);
    }}
  >
    Details
  </a>
  {app.status === "Unpaid" && (
    <a
      href="#"
      className="btn btn-sm btn-primary payBillBtn"
      onClick={() => {
        payTheBill(app.id);
      }}
    >
      Pay
    </a>
  )}
</div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && selectedAppointment && (
  <AppDetailsModal
    selectedAppointment={selectedAppointment}
    onClose={() => setShowModal(false)}
  />
)}

    </div>
  );
}
