using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            return await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                })
                .OrderByDescending(u => u.Id)
                .ToListAsync();
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] RoleUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Username == "admin")
            {
                return BadRequest(new { message = "Cannot modify the system default admin account." });
            }

            if (dto.Role != "Admin" && dto.Role != "Customer")
            {
                return BadRequest(new { message = "Invalid role. Role must be either 'Admin' or 'Customer'." });
            }

            user.Role = dto.Role;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully.", role = user.Role });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Username == "admin")
            {
                return BadRequest(new { message = "Cannot delete the system default admin account." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
        }
    }

    public class RoleUpdateDto
    {
        public string Role { get; set; } = string.Empty;
    }
}
