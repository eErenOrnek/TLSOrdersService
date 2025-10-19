using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersService.Data;
using OrdersService.Models;

namespace OrdersService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderDetailsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderDetailsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetails()
    {
        return await _context.OrderDetails
            .Include(od => od.Order)
            .Include(od => od.Stock)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDetail>> GetOrderDetail(int id)
    {
        var orderDetail = await _context.OrderDetails
            .Include(od => od.Order)
            .Include(od => od.Stock)
            .FirstOrDefaultAsync(od => od.OrderDetailId == id);

        if (orderDetail == null)
        {
            return NotFound();
        }

        return orderDetail;
    }

    [HttpGet("Order/{orderId}")]
    public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetailsByOrder(int orderId)
    {
        return await _context.OrderDetails
            .Include(od => od.Stock)
            .Where(od => od.OrderId == orderId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<OrderDetail>> PostOrderDetail(OrderDetail orderDetail)
    {
        _context.OrderDetails.Add(orderDetail);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.OrderDetailId }, orderDetail);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutOrderDetail(int id, OrderDetail orderDetail)
    {
        if (id != orderDetail.OrderDetailId)
        {
            return BadRequest();
        }

        _context.Entry(orderDetail).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OrderDetailExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrderDetail(int id)
    {
        var orderDetail = await _context.OrderDetails.FindAsync(id);
        if (orderDetail == null)
        {
            return NotFound();
        }

        _context.OrderDetails.Remove(orderDetail);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool OrderDetailExists(int id)
    {
        return _context.OrderDetails.Any(e => e.OrderDetailId == id);
    }
}
