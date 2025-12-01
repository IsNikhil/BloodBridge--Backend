using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/bloodtypes")]
public class BloodTypesController : ControllerBase
{
    private readonly DataContext _context;

    public BloodTypesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context
            .BloodTypes
            .Select(x => new BloodTypeGetDto
            {
                Id = x.Id,
                BloodTypeName = x.BloodTypeName
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(
        [FromRoute] int id)
    {
        var response = new Response();

        var bloodType = _context.BloodTypes.FirstOrDefault(x => x.Id == id);

        var bloodTypeGetDto = new BloodTypeGetDto
        {
            Id = bloodType.Id,
            BloodTypeName = bloodType.BloodTypeName
        };

        response.Data = bloodTypeGetDto;

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create(
        [FromBody] BloodTypeCreateDto bloodTypeCreateDto)
    {
        var response = new Response();
        
        var bloodTypeToCreate = new BloodType
        {
            BloodTypeName = bloodTypeCreateDto.BloodTypeName
        };

        _context.BloodTypes.Add(bloodTypeToCreate);
        _context.SaveChanges();

        var bloodTypeGetDto = new BloodTypeGetDto
        {
            Id = bloodTypeToCreate.Id,
            BloodTypeName = bloodTypeToCreate.BloodTypeName
        };

        response.Data = bloodTypeGetDto;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Edit(
        [FromRoute] int id, 
        [FromBody] BloodTypeUpdateDto bloodTypeUpdateDto)
    {
        var response = new Response();

        
        var bloodTypeToEdit = _context.BloodTypes.FirstOrDefault(x => x.Id == id);

        bloodTypeToEdit.BloodTypeName = bloodTypeUpdateDto.BloodTypeName;

        _context.SaveChanges();

        var bloodTypeGetDto = new BloodTypeGetDto
        {
            Id = bloodTypeToEdit.Id,
            BloodTypeName = bloodTypeToEdit.BloodTypeName
        };

        response.Data = bloodTypeGetDto;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var bloodType = _context.BloodTypes.FirstOrDefault(x => x.Id == id);
        

        _context.BloodTypes.Remove(bloodType);
        _context.SaveChanges();

        return Ok(response);
    }
}