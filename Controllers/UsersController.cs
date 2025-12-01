using System.Linq;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    public UsersController(
        DataContext context,
        UserManager<User> userManager,
        RoleManager<Role> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    // -------------------------------------------------------
    // GET ALL USERS
    // -------------------------------------------------------
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context.Users
            .Select(x => new UserGetDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                Gender = x.Gender,
                Address = x.Address,
                CreateDate = x.CreateDate,
                UpdateDate = x.UpdateDate,
                LastDonationDate = x.LastDonationDate,
                DateOfBirth = x.DateOfBirth,
                UserType = x.UserType,
                BloodType = x.BloodType
            })
            .ToList();

        return Ok(response);
    }

    // -------------------------------------------------------
    // GET USER BY ID
    // -------------------------------------------------------
    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] int id)
    {
        var response = new Response();

        var user = _context.Users.FirstOrDefault(x => x.Id == id);
        if (user == null)
        {
            response.AddError("id", "No user found.");
            return NotFound(response);
        }

        response.Data = new UserGetDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Gender = user.Gender,
            Address = user.Address,
            CreateDate = user.CreateDate,
            UpdateDate = user.UpdateDate,
            LastDonationDate = user.LastDonationDate,
            DateOfBirth = user.DateOfBirth,
            UserType = user.UserType,
            BloodType = user.BloodType
        };

        return Ok(response);
    }

    // -------------------------------------------------------
    // CREATE USER for sign up page
    // -------------------------------------------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
    {
        var response = new Response();

        // Basic validation
        if (string.IsNullOrWhiteSpace(dto.FirstName))
            response.AddError("firstName", "First name is required.");

        if (string.IsNullOrWhiteSpace(dto.LastName))
            response.AddError("lastName", "Last name is required.");

        if (string.IsNullOrWhiteSpace(dto.UserName))
            response.AddError("userName", "Username is required.");

        if (string.IsNullOrWhiteSpace(dto.Password))
            response.AddError("password", "Password is required.");

        if (response.HasErrors)
            return BadRequest(response);


        // Create new user object
        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            UserName = dto.UserName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Gender = dto.Gender,
            Address = dto.Address,
            CreateDate = dto.CreateDate,
            UpdateDate = dto.UpdateDate,
            LastDonationDate = dto.LastDonationDate,
            DateOfBirth = dto.DateOfBirth,
            UserType = dto.UserType,
            BloodType = dto.BloodType
        };

        // Create user with Identity
        var createResult = await _userManager.CreateAsync(user, dto.Password);

        if (!createResult.Succeeded)
        {
            foreach (var err in createResult.Errors)
                response.AddError(err.Code, err.Description);

            return BadRequest(response);
        }

        
        if (!await _roleManager.RoleExistsAsync(dto.UserType))
        {
            await _roleManager.CreateAsync(new Role { Name = dto.UserType });
        }

        await _userManager.AddToRoleAsync(user, dto.UserType);


        // Return newly created user
        response.Data = new UserGetDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Gender = user.Gender,
            Address = user.Address,
            CreateDate = user.CreateDate,
            UpdateDate = user.UpdateDate,
            LastDonationDate = user.LastDonationDate,
            DateOfBirth = user.DateOfBirth,
            UserType = user.UserType,
            BloodType = user.BloodType
        };

        return Created("", response);
    }

    // -------------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------------
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UserUpdateDto dto)
    {
        var response = new Response();
        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "User not found.");
            return NotFound(response);
        }

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.UserName = dto.UserName;
        user.Email = dto.Email;
        user.PhoneNumber = dto.PhoneNumber;
        user.Gender = dto.Gender;
        user.Address = dto.Address;
        user.CreateDate = dto.CreateDate;
        user.UpdateDate = dto.UpdateDate;
        user.LastDonationDate = dto.LastDonationDate;
        user.DateOfBirth = dto.DateOfBirth;
        user.UserType = dto.UserType;
        user.BloodType = dto.BloodType;

        _context.SaveChanges();

        response.Data = dto;
        return Ok(response);
    }

    // -------------------------------------------------------
    // DELETE USER
    // -------------------------------------------------------
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "User not found.");
            return NotFound(response);
        }

        _context.Users.Remove(user);
        _context.SaveChanges();

        return Ok(response);
    }
}
