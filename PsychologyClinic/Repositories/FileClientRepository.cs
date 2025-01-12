using PsychologyClinic.Models;
using System.Text.Json;

namespace PsychologyClinic.Repositories
{
    public class FileClientRepository
    {
        private readonly string _filePath;

        public FileClientRepository(string filePath)
        {
            _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "clients.json");
            Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]"); // Create empty JSON array
            }
        }

        public List<Client> GetAll()
        {
            if (!File.Exists(_filePath)) return new List<Client>();

            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<Client>>(json) ?? new List<Client>();
            }
            catch (JsonException)
            {
                // Handle the case where the JSON is invalid
                return new List<Client>();
            }
        }

        public Client? GetById(int id)
        {
            var clients = GetAll();
            return clients.FirstOrDefault(c => c.Id == id);
        }

        public void Add(Client client)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var clients = GetAll();
                client.Id = clients.Count > 0 ? clients.Max(c => c.Id) + 1 : 1;
                clients.Add(client);
                SaveAll(clients);
            }
        }

        public void Update(Client updatedClient)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var clients = GetAll();
                var index = clients.FindIndex(c => c.Id == updatedClient.Id);
                if (index != -1)
                {
                    clients[index] = updatedClient;
                    SaveAll(clients);
                }
            }
        }

        public void Delete(int id)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var clients = GetAll();
                clients.RemoveAll(c => c.Id == id);
                SaveAll(clients);
            }
        }

        private void SaveAll(List<Client> clients)
        {
            lock (_filePath) // Ensure thread-safety
            {
                var jsonData = JsonSerializer.Serialize(clients, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, jsonData);
            }
        }
    }
}
