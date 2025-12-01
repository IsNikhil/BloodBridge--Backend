using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities
{
    public class Appointment
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int HospitalId { get; set; }

        public string AppointmentType { get; set; }
        public string Status { get; set; }

        public DateTime Date { get; set; }

        public string Info { get; set; }  
        public User User { get; set; }
        public Hospital Hospital { get; set; }
    }

    // ===================== DTOs =====================

    public class AppointmentGetDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public string UserEmail { get; set; }
        public string UserPhoneNumber { get; set; }

        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public string HospitalAddress { get; set; }
        public string HospitalPhone { get; set; }
        public string HospitalEmail { get; set; }

        public string AppointmentType { get; set; }
        public string Status { get; set; }

        public DateTime Date { get; set; }

        public string Info { get; set; }  
    }

    public class AppointmentCreateDto
    {
        public int UserId { get; set; }
        public int HospitalId { get; set; }

        public string AppointmentType { get; set; }
        public string Status { get; set; }

        public DateTime Date { get; set; }

        public string Info { get; set; }  
    }

    public class AppointmentUpdateDto
    {
        public int UserId { get; set; }
        public int HospitalId { get; set; }

        public string AppointmentType { get; set; }
        public string Status { get; set; }

        public DateTime Date { get; set; }

        public string Info { get; set; }  
    }

    // ===================== EF CONFIG =====================

    public class AppointmentEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");

            builder
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId);

            builder
                .HasOne(a => a.Hospital)
                .WithMany()
                .HasForeignKey(a => a.HospitalId);
        }
    }
}
