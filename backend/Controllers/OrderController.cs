using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int userId = int.Parse(userIdClaim.Value);

            if (dto.Items == null || dto.Items.Count == 0)
            {
                return BadRequest(new { message = "Order must contain at least one item." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    UserId = userId,
                    CustomerName = dto.CustomerName,
                    CustomerEmail = dto.CustomerEmail,
                    CustomerPhone = dto.CustomerPhone,
                    CustomerAddress = dto.CustomerAddress,
                    Status = "Pending",
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = 0
                };

                decimal total = 0;

                foreach (var itemDto in dto.Items)
                {
                    var product = await _context.Products.FindAsync(itemDto.ProductId);
                    if (product == null)
                    {
                        return NotFound(new { message = $"Product with ID {itemDto.ProductId} not found." });
                    }

                    if (product.Stock < itemDto.Quantity)
                    {
                        return BadRequest(new { message = $"Insufficient stock for product '{product.Name}'. Available: {product.Stock}" });
                    }

                    // Reduce stock
                    product.Stock -= itemDto.Quantity;

                    var orderItem = new OrderItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Price = product.Price,
                        Quantity = itemDto.Quantity
                    };

                    order.OrderItems.Add(orderItem);
                    total += product.Price * itemDto.Quantity;
                }

                order.TotalAmount = total;
                _context.Orders.Add(order);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Order placed successfully.", orderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while placing the order.", error = ex.Message });
            }
        }

        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized();
            }
            int userId = int.Parse(userIdClaim.Value);

            return await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, OrderUpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
            {
                return BadRequest(new { message = $"Invalid status. Must be one of: {string.Join(", ", validStatuses)}" });
            }

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Order status updated to {dto.Status}.", order });
        }
    }
}
