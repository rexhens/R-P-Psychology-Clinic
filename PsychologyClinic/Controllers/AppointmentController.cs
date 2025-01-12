using Microsoft.AspNetCore.Mvc;
using PsychologyClinic.Models;
using PsychologyClinic.Models.DTO;
using PsychologyClinic.Repositories;

namespace PsychologyClinic.Controllers
{
    [Route("api/appointments")]
    public class AppointmentController : Controller
    {
        private readonly FileAppointmentRepository _repository;
        private readonly FileClientRepository _clientRepository;

        public AppointmentController()
        {
            _repository = new FileAppointmentRepository(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "appointments.json"));
            _clientRepository = new FileClientRepository(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "clients.json"));
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
            var appointments = _repository.GetAll();
            foreach(var app in appointments)
            {
                app.Client = _clientRepository.GetById(app.ClientId);
            }
            if(appointments == null)
            {
                return Ok();
            }
            return Ok(appointments);
            
        }
        [HttpPost]
        [Route("add")]
        public IActionResult AddAppointment([FromBody]AppointmentDTO appointment)
        {
            var apiKey = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                return Unauthorized("Invalid API key");
            }
            var clients = _clientRepository.GetAll();
            if (clients.Contains(_clientRepository.GetById(appointment.ClientId))){
                return BadRequest("This client does not exist!");
            }
            var app = new Appointment { DateReserved = appointment.DateReserved, AppointemtType = appointment.AppointemtType, Amount = appointment.Amount, ClientId = appointment.ClientId, Status = "Unpaid" };
            if (!ValidateDateAppointment(app, _repository.GetAll()))
            {
                return BadRequest("The Hours are not avilable!");
            }
            _repository.Add(app);
            return Ok(app);
        }
        [HttpPost]
        [Route("cancel")]
        public IActionResult CancelAppointment(int appointmentId)
        {
            var apiKey = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                return Unauthorized("Invalid API key");
            }
            var app = _repository.GetById(appointmentId);
            if(app == null)
            {
                return BadRequest("This appointment does not exist");
            }
            var apps = _clientRepository.GetAll();
            _repository.Cancel(appointmentId);
            return Ok("Appointment canceled successfully");
        }
        private bool ValidateDateAppointment(Models.Appointment appointment, List<Models.Appointment> appointmentsList)
        {
            try
            {
                if (appointment.DateReserved < DateTime.Now)
                {
                    return false;
                }
                if (appointment.DateReserved.TimeOfDay < TimeSpan.FromHours(7) || appointment.DateReserved.TimeOfDay
                    > TimeSpan.FromHours(20))
                {
                    return false;
                }
                foreach (var app in appointmentsList)
                {

                    if (app.DateReserved.Year == appointment.DateReserved.Year && app.DateReserved.Month == appointment.DateReserved.Month
                       && app.DateReserved.Day == appointment.DateReserved.Day && app.DateReserved.Hour == appointment.DateReserved.Hour

                       || app.DateReserved.Year == appointment.DateReserved.Year && app.DateReserved.Month == appointment.DateReserved.Month
                       && app.DateReserved.Day == appointment.DateReserved.Day && app.DateReserved.Hour + 1 == appointment.DateReserved.Hour
                        && app.DateReserved.Minute > appointment.DateReserved.Minute

                         || app.DateReserved.Year == appointment.DateReserved.Year && app.DateReserved.Month == appointment.DateReserved.Month
                       && app.DateReserved.Day == appointment.DateReserved.Day && app.DateReserved.Hour - 1 == appointment.DateReserved.Hour
                        && app.DateReserved.Minute != appointment.DateReserved.Minute

                        )
                    {
                        return false;
                    }

                }
            }
            catch (Exception ex)
            {
               Console.WriteLine( ex.ToString() );

            }
            return true;

        }
        private bool IsValidApiKey(string apiKey)
        {
            if (apiKey != AdminController.publicApiKey)
            {
                return false;
            }
            return true;
        }

    }
}
