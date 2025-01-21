import { useState } from "react";

export default function CreateNewClient() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [firstComplaint, setFirstComplaint] = useState("");
  const [adress, setAdress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !name || !surname || !adress || !firstComplaint) {
      alert("Please fill out all fields.");
      return;
    }

    const clientData = {
      BrazilianId: id,
      Name: name,
      Surname: surname,
      Adress: adress,
      FirstComplain: firstComplaint,
    };

    try {
      const apiKey = localStorage.getItem("apiKey");
       if(!apiKey)
      {
        alert("Please login first");
        window.location.href = '/login'
      }
      console.log(JSON.stringify(clientData))
      const response = await fetch("https://localhost:7175/api/clients/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(clientData),
      });
     
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        return;
      }

      if (response.status === 201) {
        alert("Client added successfully.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("There was an error while adding the client.");
    }
  };

  return (
    <div id="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Client Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Client Surname</label>
          <input
            type="text"
            name="surname"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brazilianId">Brazilian Id</label>
          <input
            type="text"
            name="brazilianId"
            id="brazilianId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="adress">Address</label>
          <input
            type="text"
            name="adress"
            id="adress"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstComplaint">First Complaint</label>
          <input
            type="text"
            name="firstComplaint"
            id="firstComplaint"
            value={firstComplaint}
            onChange={(e) => setFirstComplaint(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary" id="submitBtn">
          Submit
        </button>
      </form>
      <a href="/clients" id="backBtn">
        Back
      </a>
    </div>
  );
}
