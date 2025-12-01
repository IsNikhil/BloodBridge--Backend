using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Request
{
    public int Id { get; set; }
    public string RequesterName { get; set; }
    public string BloodType { get; set; }
    public int Quantity { get; set; }
    public string HospitalName { get; set; }
    public DateTime RequestDate { get; set; }
}

public class RequestGetDto
{
    public int Id { get; set; }
    public string RequesterName { get; set; }
    public string BloodType { get; set; }
    public int Quantity { get; set; }
    public string HospitalName { get; set; }
    public DateTime RequestDate { get; set; }
}

public class RequestCreateDto
{
    public string RequesterName { get; set; }
    public string BloodType { get; set; }
    public int Quantity { get; set; }
    public string HospitalName { get; set; }
    public DateTime RequestDate { get; set; }
}

public class RequestUpdateDto
{
    public string RequesterName { get; set; }
    public string BloodType { get; set; }
    public int Quantity { get; set; }
    public string HospitalName { get; set; }
    public DateTime RequestDate { get; set; }
}

public class RequestEntityConfiguration : IEntityTypeConfiguration<Request>
{
    public void Configure(EntityTypeBuilder<Request> builder)
    {
        builder.ToTable("Requests");
    }
}