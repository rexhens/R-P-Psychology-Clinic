namespace PsychologyClinic.Models.DTO
{
    public class AppointmentDTO
    {
        public int ClientId { get; set; }
        public DateTime DateReserved { get; set; }
        public string HourFinished()
        {
            var dateFinished = DateReserved.AddHours(1);
            return dateFinished.ToString("HH:mm");
        }
        public required string AppointemtType { get; set; }
        public double Amount { get; set; }
        
    }
}
