using System.Reflection;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Data;

public sealed class DataContext : IdentityDbContext<User, Role, int>
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }
    public DbSet<BloodInventory> BloodInventories { get; set; }
    public DbSet<BloodType> BloodTypes { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Hospital> Hospitals { get; set; }
    
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).GetTypeInfo().Assembly);
    }
}

