namespace PsychologyClinic.Models.DTO
{
    public class ClientDTO
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Adress { get; set; }
        public required string FirstComplain { get; set; }
        public string? BrazilianId { get; set; }
    }
}
