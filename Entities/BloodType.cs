using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class BloodType
{
    public int Id { get; set; }
    public string BloodTypeName { get; set; } 
    
}

public class BloodTypeGetDto
{
    public int Id { get; set; }
    public string BloodTypeName { get; set; }
}

public class BloodTypeCreateDto
{
    public string BloodTypeName { get; set; }
}

public class BloodTypeUpdateDto
{
    public string BloodTypeName { get; set; }
}

public class BloodTypeEntityConfiguration : IEntityTypeConfiguration<BloodType>
{
    public void Configure(EntityTypeBuilder<BloodType> builder)
    {
        builder.ToTable("BloodTypes");
    }
}