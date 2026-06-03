using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly DataContext _context;

        public DashboardController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalRevenue = await _context.Orders
                .Where(o => o.Status != "Cancelled")
                .SumAsync(o => o.TotalAmount);

            var totalOrders = await _context.Orders.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalCustomers = await _context.Users.Where(u => u.Role == "Customer").CountAsync();

            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.TotalAmount,
                    o.Status,
                    o.OrderDate
                })
                .ToListAsync();

            var salesByCategory = await _context.OrderItems
                .Include(oi => oi.Product)
                .GroupBy(oi => oi.Product != null ? oi.Product.Category : "Khác")
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(x => x.Price * x.Quantity),
                    Quantity = g.Sum(x => x.Quantity)
                })
                .ToListAsync();

            return Ok(new
            {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                recentOrders,
                salesByCategory
            });
        }
    }
}
