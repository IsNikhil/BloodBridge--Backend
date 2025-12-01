using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/appointment")]
    public class AppointmentController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public AppointmentController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        // -------------------------------------------------------
        // GET ALL APPOINTMENTS
        // -------------------------------------------------------
        [HttpGet]
        public IActionResult GetAll()
        {
            var response = new Response();

            var data = _dataContext
                .Set<Appointment>()
                .Include(a => a.User)
                .Include(a => a.Hospital)
                .Select(a => new AppointmentGetDto
                {
                    Id = a.Id,

                    UserId = a.UserId,
                    UserFullName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email,
                    UserPhoneNumber = a.User.PhoneNumber,

                    HospitalId = a.HospitalId,
                    HospitalName = a.Hospital.Name,
                    HospitalAddress = a.Hospital.Address,
                    HospitalPhone = a.Hospital.Phone,
                    HospitalEmail = a.Hospital.Email,

                    AppointmentType = a.AppointmentType,
                    Status = a.Status,
                    Date = a.Date,
                    Info = a.Info
                })
                .ToList();

            response.Data = data;
            return Ok(response);
        }

        // -------------------------------------------------------
        // GET APPOINTMENT BY ID
        // -------------------------------------------------------
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var response = new Response();

            var appointment = _dataContext
                .Set<Appointment>()
                .Include(a => a.User)
                .Include(a => a.Hospital)
                .Where(a => a.Id == id)
                .Select(a => new AppointmentGetDto
                {
                    Id = a.Id,

                    UserId = a.UserId,
                    UserFullName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email,
                    UserPhoneNumber = a.User.PhoneNumber,

                    HospitalId = a.HospitalId,
                    HospitalName = a.Hospital.Name,
                    HospitalAddress = a.Hospital.Address,
                    HospitalPhone = a.Hospital.Phone,
                    HospitalEmail = a.Hospital.Email,

                    AppointmentType = a.AppointmentType,
                    Status = a.Status,
                    Date = a.Date,
                    Info = a.Info
                })
                .FirstOrDefault();

            response.Data = appointment;
            return Ok(response);
        }

        // -------------------------------------------------------
        // CREATE APPOINTMENT
        // -------------------------------------------------------
        [HttpPost]
        public IActionResult Create([FromBody] AppointmentCreateDto createDto)
        {
            var response = new Response();

            // Get logged-in user's ID (correct fix)
            var userId = int.Parse(User.FindFirst("sub").Value);

            var appointmentToCreate = new Appointment
            {
                UserId = userId, 
                HospitalId = createDto.HospitalId,
                Date = createDto.Date,
                AppointmentType = createDto.AppointmentType,
                Status = createDto.Status,
                Info = createDto.Info
            };

            _dataContext.Set<Appointment>().Add(appointmentToCreate);
            _dataContext.SaveChanges();

            var appointmentToReturn = _dataContext
                .Set<Appointment>()
                .Include(a => a.User)
                .Include(a => a.Hospital)
                .Where(a => a.Id == appointmentToCreate.Id)
                .Select(a => new AppointmentGetDto
                {
                    Id = a.Id,

                    UserId = a.UserId,
                    UserFullName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email,
                    UserPhoneNumber = a.User.PhoneNumber,

                    HospitalId = a.HospitalId,
                    HospitalName = a.Hospital.Name,
                    HospitalAddress = a.Hospital.Address,
                    HospitalPhone = a.Hospital.Phone,
                    HospitalEmail = a.Hospital.Email,

                    AppointmentType = a.AppointmentType,
                    Status = a.Status,
                    Date = a.Date,
                    Info = a.Info
                })
                .FirstOrDefault();

            response.Data = appointmentToReturn;
            return Created("", response);
        }

        // -------------------------------------------------------
        // UPDATE APPOINTMENT
        // -------------------------------------------------------
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] AppointmentUpdateDto updateDto)
        {
            var response = new Response();

            var appointmentToUpdate = _dataContext.Set<Appointment>().FirstOrDefault(a => a.Id == id);

            appointmentToUpdate.UserId = updateDto.UserId;
            appointmentToUpdate.HospitalId = updateDto.HospitalId;
            appointmentToUpdate.Date = updateDto.Date;
            appointmentToUpdate.AppointmentType = updateDto.AppointmentType;
            appointmentToUpdate.Status = updateDto.Status;
            appointmentToUpdate.Info = updateDto.Info;

            _dataContext.SaveChanges();

            var appointmentToReturn = _dataContext
                .Set<Appointment>()
                .Include(a => a.User)
                .Include(a => a.Hospital)
                .Where(a => a.Id == appointmentToUpdate.Id)
                .Select(a => new AppointmentGetDto
                {
                    Id = a.Id,

                    UserId = a.UserId,
                    UserFullName = a.User.FirstName + " " + a.User.LastName,
                    UserEmail = a.User.Email,
                    UserPhoneNumber = a.User.PhoneNumber,

                    HospitalId = a.HospitalId,
                    HospitalName = a.Hospital.Name,
                    HospitalAddress = a.Hospital.Address,
                    HospitalPhone = a.Hospital.Phone,
                    HospitalEmail = a.Hospital.Email,

                    AppointmentType = a.AppointmentType,
                    Status = a.Status,
                    Date = a.Date,
                    Info = a.Info
                })
                .FirstOrDefault();

            response.Data = appointmentToReturn;
            return Ok(response);
        }
        
        // -------------------------------------------------------
// UPDATE ONLY STATUS (Approve / Cancel)
// -------------------------------------------------------
        [HttpPut("{id}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] string newStatus)
        {
            var response = new Response();

            var appointment = _dataContext
                .Set<Appointment>()
                .FirstOrDefault(a => a.Id == id);

            if (appointment == null)
            {
                response.AddError("NotFound", "Appointment not found");
                return NotFound(response);
            }

            // Update only the status
            appointment.Status = newStatus;

            _dataContext.SaveChanges();

            response.Data = true;
            return Ok(response);
        }


        // -------------------------------------------------------
        // DELETE APPOINTMENT
        // -------------------------------------------------------
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var response = new Response();

            var appointmentToDelete = _dataContext.Set<Appointment>().FirstOrDefault(a => a.Id == id);

            _dataContext.Set<Appointment>().Remove(appointmentToDelete);
            _dataContext.SaveChanges();

            response.Data = true;
            return Ok(response);
        }
    }
}
