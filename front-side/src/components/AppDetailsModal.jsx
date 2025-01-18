import './AppDetailsModal.css';
import { useEffect } from 'react';

export default function AppDetailsModal({ selectedAppointment, onClose }) {
  
  // Define the payTheBill function that takes appointmentId as a parameter
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

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Appointment Details</h5>
          </div>
          <div className="modal-body">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedAppointment.dateReserved).toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong> {selectedAppointment.appointemtType}
            </p>
            <p>
              <strong>Client:</strong>{" "}
              {selectedAppointment.client.name}{" "}
              {selectedAppointment.client.surname}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedAppointment.amount}
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary payBtn"
              onClick={() => payTheBill(selectedAppointment.id)} // Pass the appointmentId when clicked
            >
              Pay the bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
