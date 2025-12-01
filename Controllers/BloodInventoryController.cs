using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/bloodinventorys")]
    public class BloodInventoryController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public BloodInventoryController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        // DTO for unit updates
        public class UnitsDto
        {
            public int Units { get; set; }
        }

        // ------------------------------------------------------
        // GET ALL
        // ------------------------------------------------------
        [HttpGet]
        public IActionResult GetAll()
        {
            var response = new Response();

            var data = _dataContext.BloodInventories
                .Select(inv => new BloodInventoryGetDto
                {
                    Id = inv.Id,
                    BloodTypeId = inv.BloodTypeId,
                    BloodTypeName = _dataContext.BloodTypes
                        .Where(bt => bt.Id == inv.BloodTypeId)
                        .Select(bt => bt.BloodTypeName)
                        .FirstOrDefault(),

                    HospitalId = inv.HospitalId,
                    HospitalName = _dataContext.Hospitals
                        .Where(h => h.Id == inv.HospitalId)
                        .Select(h => h.Name)
                        .FirstOrDefault(),

                    AvailableUnits = inv.AvailableUnits
                })
                .ToList();

            response.Data = data;
            return Ok(response);
        }

        // ------------------------------------------------------
        // GET BY ID
        // ------------------------------------------------------
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var response = new Response();

            var inv = _dataContext.BloodInventories
                .Where(x => x.Id == id)
                .Select(inv => new BloodInventoryGetDto
                {
                    Id = inv.Id,
                    BloodTypeId = inv.BloodTypeId,
                    BloodTypeName = _dataContext.BloodTypes
                        .Where(bt => bt.Id == inv.BloodTypeId)
                        .Select(bt => bt.BloodTypeName)
                        .FirstOrDefault(),

                    HospitalId = inv.HospitalId,
                    HospitalName = _dataContext.Hospitals
                        .Where(h => h.Id == inv.HospitalId)
                        .Select(h => h.Name)
                        .FirstOrDefault(),

                    AvailableUnits = inv.AvailableUnits
                })
                .FirstOrDefault();

            response.Data = inv;
            return Ok(response);
        }

        // ------------------------------------------------------
        // CREATE
        // ------------------------------------------------------
        [HttpPost]
        public IActionResult Create([FromBody] BloodInventoryCreateDto createDto)
        {
            var response = new Response();

            var newInv = new BloodInventory
            {
                BloodTypeId = createDto.BloodTypeId,
                HospitalId = createDto.HospitalId,
                AvailableUnits = 0
            };

            _dataContext.BloodInventories.Add(newInv);
            _dataContext.SaveChanges();

            var result = new BloodInventoryGetDto
            {
                Id = newInv.Id,
                BloodTypeId = newInv.BloodTypeId,
                BloodTypeName = _dataContext.BloodTypes
                    .Where(bt => bt.Id == newInv.BloodTypeId)
                    .Select(bt => bt.BloodTypeName)
                    .FirstOrDefault(),

                HospitalId = newInv.HospitalId,
                HospitalName = _dataContext.Hospitals
                    .Where(h => h.Id == newInv.HospitalId)
                    .Select(h => h.Name)
                    .FirstOrDefault(),

                AvailableUnits = newInv.AvailableUnits
            };

            response.Data = result;
            return Created("", response);
        }

        // ------------------------------------------------------
        // EDIT BASIC DATA
        // ------------------------------------------------------
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BloodInventoryUpdateDto updateDto)
        {
            var response = new Response();

            var inv = _dataContext.BloodInventories.FirstOrDefault(x => x.Id == id);
            if (inv == null)
            {
                response.AddError("Id", "Inventory not found");
                return NotFound(response);
            }

            inv.BloodTypeId = updateDto.BloodTypeId;
            inv.HospitalId = updateDto.HospitalId;

            _dataContext.SaveChanges();

            var result = new BloodInventoryGetDto
            {
                Id = inv.Id,
                BloodTypeId = inv.BloodTypeId,
                BloodTypeName = _dataContext.BloodTypes
                    .Where(bt => bt.Id == inv.BloodTypeId)
                    .Select(bt => bt.BloodTypeName)
                    .FirstOrDefault(),

                HospitalId = inv.HospitalId,
                HospitalName = _dataContext.Hospitals
                    .Where(h => h.Id == inv.HospitalId)
                    .Select(h => h.Name)
                    .FirstOrDefault(),

                AvailableUnits = inv.AvailableUnits
            };

            response.Data = result;
            return Ok(response);
        }

        // ------------------------------------------------------
        // ADD UNITS (FIXED)
        // ------------------------------------------------------
        [HttpPost("{id}/addunits")]
        public IActionResult AddUnits(int id, [FromBody] UnitsDto dto)
        {
            var response = new Response();

            var inv = _dataContext.BloodInventories.FirstOrDefault(x => x.Id == id);
            if (inv == null)
            {
                response.AddError("Id", "Inventory not found");
                return NotFound(response);
            }

            if (dto.Units <= 0)
            {
                response.AddError("Units", "Units must be greater than 0");
                return BadRequest(response);
            }

            inv.AvailableUnits += dto.Units;
            _dataContext.SaveChanges();

            response.Data = inv;
            return Ok(response);
        }

        // ------------------------------------------------------
        // REMOVE UNITS 
        // ------------------------------------------------------
        [HttpPost("{id}/removeunits")]
        public IActionResult RemoveUnits(int id, [FromBody] UnitsDto dto)
        {
            var response = new Response();

            var inv = _dataContext.BloodInventories.FirstOrDefault(x => x.Id == id);
            if (inv == null)
            {
                response.AddError("Id", "Inventory not found");
                return NotFound(response);
            }

            if (dto.Units <= 0)
            {
                response.AddError("Units", "Units must be greater than 0");
                return BadRequest(response);
            }

            if (inv.AvailableUnits < dto.Units)
            {
                response.AddError("Units", "Not enough units available");
                return BadRequest(response);
            }

            inv.AvailableUnits -= dto.Units;
            _dataContext.SaveChanges();

            response.Data = inv;
            return Ok(response);
        }

        // ------------------------------------------------------
        // DELETE
        // ------------------------------------------------------
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var response = new Response();

            var inv = _dataContext.BloodInventories.FirstOrDefault(x => x.Id == id);
            if (inv == null)
            {
                response.AddError("Id", "Inventory not found");
                return NotFound(response);
            }

            _dataContext.BloodInventories.Remove(inv);
            _dataContext.SaveChanges();

            response.Data = true;
            return Ok(response);
        }
    }
}
