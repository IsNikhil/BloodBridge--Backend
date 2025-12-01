using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities
{
    public class BloodInventory
    {
        public int Id { get; set; }
        public int BloodTypeId { get; set; }
        public int HospitalId { get; set; }
        public int AvailableUnits { get; set; }
    }

    public class BloodInventoryCreateDto
    {
        public int BloodTypeId { get; set; }
        public int HospitalId { get; set; }
    }

    public class BloodInventoryGetDto
    {
        public int Id { get; set; }
        public int BloodTypeId { get; set; }
        public int HospitalId { get; set; }
        public int AvailableUnits { get; set; }

        public string BloodTypeName { get; set; }
        public string HospitalName { get; set; }
    }

    public class BloodInventoryUpdateDto
    {
        public int BloodTypeId { get; set; }
        public int HospitalId { get; set; }
    }

    public class BloodInventoryEntityConfiguration : IEntityTypeConfiguration<BloodInventory>
    {
        public void Configure(EntityTypeBuilder<BloodInventory> builder)
        {
            builder.ToTable("BloodInventorys");
        }
    }
}
