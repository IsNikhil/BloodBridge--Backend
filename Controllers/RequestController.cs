using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/requests")]
public class RequestsController : ControllerBase
{
    private readonly DataContext _context;

    public RequestsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context
            .Requests
            .Select(x => new RequestGetDto
            {
                Id = x.Id,
                RequesterName = x.RequesterName,
                BloodType = x.BloodType,
                Quantity = x.Quantity,
                HospitalName = x.HospitalName,
                RequestDate = x.RequestDate
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] int id)
    {
        var response = new Response();

        var request = _context.Requests.FirstOrDefault(x => x.Id == id);

        var requestGetDto = new RequestGetDto
        {
            Id = request.Id,
            RequesterName = request.RequesterName,
            BloodType = request.BloodType,
            Quantity = request.Quantity,
            HospitalName = request.HospitalName,
            RequestDate = request.RequestDate
        };

        response.Data = requestGetDto;

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] RequestCreateDto requestCreateDto)
    {
        var response = new Response();

        var requestToCreate = new Request
        {
            RequesterName = requestCreateDto.RequesterName,
            BloodType = requestCreateDto.BloodType,
            Quantity = requestCreateDto.Quantity,
            HospitalName = requestCreateDto.HospitalName,
            RequestDate = requestCreateDto.RequestDate
        };

        _context.Requests.Add(requestToCreate);
        _context.SaveChanges();

        var requestGetDto = new RequestGetDto
        {
            Id = requestToCreate.Id,
            RequesterName = requestToCreate.RequesterName,
            BloodType = requestToCreate.BloodType,
            Quantity = requestToCreate.Quantity,
            HospitalName = requestToCreate.HospitalName,
            RequestDate = requestToCreate.RequestDate
        };

        response.Data = requestGetDto;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Edit([FromRoute] int id, [FromBody] RequestUpdateDto requestUpdateDto)
    {
        var response = new Response();

        var requestToEdit = _context.Requests.FirstOrDefault(x => x.Id == id);

        requestToEdit.RequesterName = requestUpdateDto.RequesterName;
        requestToEdit.BloodType = requestUpdateDto.BloodType;
        requestToEdit.Quantity = requestUpdateDto.Quantity;
        requestToEdit.HospitalName = requestUpdateDto.HospitalName;
        requestToEdit.RequestDate = requestUpdateDto.RequestDate;

        _context.SaveChanges();

        var requestGetDto = new RequestGetDto
        {
            Id = requestToEdit.Id,
            RequesterName = requestToEdit.RequesterName,
            BloodType = requestToEdit.BloodType,
            Quantity = requestToEdit.Quantity,
            HospitalName = requestToEdit.HospitalName,
            RequestDate = requestToEdit.RequestDate
        };

        response.Data = requestGetDto;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var request = _context.Requests.FirstOrDefault(x => x.Id == id);

        _context.Requests.Remove(request);
        _context.SaveChanges();

        return Ok(response);
    }
}
