using PsychologyClinic.Models;
using System.Text.Json;

namespace PsychologyClinic.Repositories
{
    public class FileAppointmentRepository
    {
        private readonly string _filePath;
        private readonly FileClientRepository _clientRepository;

        public FileAppointmentRepository(string filePath)
        {
            _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "appointments.json");
            _clientRepository = new FileClientRepository(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "clients.json"));
            Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]"); // Create empty JSON array
            }
        }

        public List<Appointment> GetAll()
        {
            if (!File.Exists(_filePath)) return new List<Appointment>();

            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<Appointment>>(json) ?? new List<Appointment>();
            }
            catch (JsonException)
            {
                // Handle the case where the JSON is invalid
                return new List<Appointment>();
            }
        }

        public Appointment? GetById(int id)
        {
            var appointments = GetAll();
            return appointments.FirstOrDefault(c => c.Id == id);
        }

        public void Add(Appointment appointment)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var appointments = GetAll();
                appointment.Id = appointments.Count > 0 ? appointments.Max(c => c.Id) + 1 : 1;
                appointments.Add(appointment);
                SaveAll(appointments);

            }
        }


        public void Cancel(int id)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var appointments = GetAll();
                appointments.RemoveAll(c => c.Id == id);
                SaveAll(appointments);
            }
        }
        public void PayTheBill(int id)
        {
            var appointments = GetAll(); // Get all appointments
            var appointment = GetById(id); // Find the appointment by ID

            if (appointment == null)
            {
                Console.WriteLine("Appointment not found.");
                return;  // Exit if appointment doesn't exist
            }

            // Update the status of the appointment
            appointment.Status = "Paid";

            // Replacing the old appointment in the list with the updated one
            var appointmentIndex = appointments.FindIndex(a => a.Id == id);
            if (appointmentIndex >= 0)
            {
                appointments[appointmentIndex] = appointment; // Update the appointment in the list
            }

            // Save the updated list of appointments
            SaveAll(appointments);  // Save the updated list
        }


        private void SaveAll(List<Appointment> appointments)
        {
            lock (_filePath) // Ensure thread-safety
            {
                try
                {
                    var jsonData = JsonSerializer.Serialize(appointments, new JsonSerializerOptions { WriteIndented = true });
                    File.WriteAllText(_filePath, jsonData);
                }catch(Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }
    }
}
