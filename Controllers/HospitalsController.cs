using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/hospitals")]
    public class HospitalsController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public HospitalsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var response = new Response();

            var data = _dataContext
                .Set<Hospital>()
                .Select(h => new Hospital()
                {
                    Id = h.Id,
                    Name = h.Name,
                    Email = h.Email,
                    Phone = h.Phone,
                    Address = h.Address,
                })
                .ToList();

            response.Data = data;
            return Ok(response);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var response = new Response();

            var hospital = _dataContext
                .Set<Hospital>()
                .Select(h => new Hospital()
                {
                    Id = h.Id,
                    Name = h.Name,
                    Email = h.Email,
                    Phone = h.Phone,
                    Address = h.Address,
                })
                .FirstOrDefault(h => h.Id == id);

            response.Data = hospital;
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Create([FromBody] HospitalCreateDto createDto)
        {
            var response = new Response();

            var hospitalToCreate = new Hospital()
            {
                Name = createDto.Name,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Address = createDto.Address,
            };

            _dataContext.Set<Hospital>().Add(hospitalToCreate);
            _dataContext.SaveChanges();

            var hospitalToReturn = new Hospital()
            {
                Id = hospitalToCreate.Id,
                Name = hospitalToCreate.Name,
                Email = hospitalToCreate.Email,
                Phone = hospitalToCreate.Phone,
                Address = hospitalToCreate.Address,
            };

            response.Data = hospitalToReturn;
            return Created("", response);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] HospitalUpdateDto updateDto)
        {
            var response = new Response();

            var hospitalToUpdate = _dataContext.Set<Hospital>().FirstOrDefault(h => h.Id == id);

            hospitalToUpdate.Name = updateDto.Name;
            hospitalToUpdate.Email = updateDto.Email;
            hospitalToUpdate.Phone = updateDto.Phone;
            hospitalToUpdate.Address = updateDto.Address;

            _dataContext.SaveChanges();

            var hospitalToReturn = new HospitalGetDto
            {
                Id = hospitalToUpdate.Id,
                Name = hospitalToUpdate.Name,
                Email = hospitalToUpdate.Email,
                Phone = hospitalToUpdate.Phone,
                Address = hospitalToUpdate.Address,
            };

            response.Data = hospitalToReturn;
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var response = new Response();

            var hospitalToDelete = _dataContext.Set<Hospital>().FirstOrDefault(h => h.Id == id);

            _dataContext.Set<Hospital>().Remove(hospitalToDelete);
            _dataContext.SaveChanges();

            response.Data = true;
            return Ok(response);
        }
    }
}
