namespace PsychologyClinic.Models.DTO
{
    public class AppointmentDTO
    {
        public int ClientId { get; set; }
        public DateTime DateReserved { get; set; }
        public required string AppointmentType { get; set; }
        public double Amount { get; set; }
        
    }
}
