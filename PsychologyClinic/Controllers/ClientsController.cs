using Microsoft.AspNetCore.Mvc;
using PsychologyClinic.Models;
using PsychologyClinic.Models.DTO;
using PsychologyClinic.Repositories;

namespace PsychologyClinic.Controllers
{
    [Route("api/clients")]
    public class ClientsController : Controller
    {
        private readonly FileClientRepository _repository;

        public ClientsController()
        {
            _repository = new FileClientRepository(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "clients.json"));
        }

        [HttpGet]
        [Route("GetAll")]
  
        public IActionResult GetAll()
        {
            var apiKey = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                return Unauthorized("Invalid API key");
            }
            var clients = _repository.GetAll();
            return Ok(clients);
        }
        private bool IsValidApiKey(string apiKey)
        {
            if(apiKey != AdminController.publicApiKey)
            {
                return false;
            }
            return true;
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var client = _repository.GetById(id);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPost]
        [Route("Add")]
        public IActionResult Create(ClientDTO clientDTO)
        {
            var client = new Client { Name=clientDTO.Name, Surname=clientDTO.Surname, Adress=clientDTO.Adress, FirstComplain=clientDTO.FirstComplain};
            _repository.Add(client);
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

    }
}
