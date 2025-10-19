using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersService.Data;
using OrdersService.Models;

namespace OrdersService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("CustomersByStock/{stockId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomersByStock(int stockId)
    {
        var customerIds = await _context.OrderDetails
            .Where(od => od.StockId == stockId && od.IsActive)
            .Select(od => od.Order!.CustomerId)
            .Distinct()
            .ToListAsync();

        var customers = await _context.Customers
            .Where(c => customerIds.Contains(c.CustomerId))
            .Include(c => c.Addresses)
            .Select(c => new
            {
                c.CustomerId,
                c.CustomerName,
                Addresses = c.Addresses.Select(a => new
                {
                    a.AddressId,
                    a.AddressType,
                    a.Country,
                    a.City,
                    a.Town,
                    a.Address,
                    a.Email,
                    a.Phone
                }).ToList()
            })
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("CustomersWithMultipleItems")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomersWithMultipleItems()
    {
        var results = await _context.OrderDetails
            .Where(od => od.Amount > 1 && od.IsActive)
            .Include(od => od.Order)
                .ThenInclude(o => o!.Customer)
            .Include(od => od.Stock)
            .Select(od => new
            {
                CustomerId = od.Order!.Customer!.CustomerId,
                CustomerName = od.Order.Customer.CustomerName,
                OrderId = od.Order.OrderId,
                OrderNo = od.Order.OrderNo,
                StockName = od.Stock!.StockName,
                Amount = od.Amount,
                OrderDate = od.Order.OrderDate
            })
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("CustomersDifferentAddresses")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomersWithDifferentAddresses()
    {
        var customers = await _context.Orders
            .Where(o => o.DeliveryAddressId != o.InvoiceAddressId && o.IsActive)
            .Include(o => o.Customer)
            .Include(o => o.DeliveryAddress)
            .Include(o => o.InvoiceAddress)
            .Select(o => new
            {
                CustomerId = o.Customer!.CustomerId,
                CustomerName = o.Customer.CustomerName,
                OrderId = o.OrderId,
                OrderNo = o.OrderNo,
                DeliveryAddress = new
                {
                    o.DeliveryAddress!.AddressType,
                    o.DeliveryAddress.City,
                    o.DeliveryAddress.Town,
                    o.DeliveryAddress.Address
                },
                InvoiceAddress = new
                {
                    o.InvoiceAddress!.AddressType,
                    o.InvoiceAddress.City,
                    o.InvoiceAddress.Town,
                    o.InvoiceAddress.Address
                }
            })
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("OrdersByCustomerName/{customerName}")]
    public async Task<ActionResult<IEnumerable<object>>> GetOrdersByCustomerName(string customerName)
    {
        var orders = await _context.Orders
            .Where(o => o.Customer!.CustomerName.Contains(customerName) && o.IsActive)
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Stock)
            .Select(o => new
            {
                o.OrderId,
                o.OrderNo,
                o.OrderDate,
                o.TotalPrice,
                o.Tax,
                CustomerName = o.Customer!.CustomerName,
                OrderDetails = o.OrderDetails.Select(od => new
                {
                    od.OrderDetailId,
                    StockName = od.Stock!.StockName,
                    od.Amount,
                    Price = od.Stock.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("OrderCountByCity/{city}")]
    public async Task<ActionResult<object>> GetOrderCountByCity(string city)
    {
        var count = await _context.Orders
            .Where(o => o.IsActive && 
                   (o.DeliveryAddress!.City.Contains(city) || o.InvoiceAddress!.City.Contains(city)))
            .CountAsync();

        return Ok(new { City = city, OrderCount = count });
    }

    [HttpGet("Statistics")]
    public async Task<ActionResult<object>> GetStatistics()
    {
        var stats = new
        {
            TotalCustomers = await _context.Customers.CountAsync(c => c.IsActive),
            TotalStocks = await _context.Stocks.CountAsync(s => s.IsActive),
            TotalOrders = await _context.Orders.CountAsync(o => o.IsActive),
            TotalRevenue = await _context.Orders.Where(o => o.IsActive).SumAsync(o => o.TotalPrice)
        };

        return Ok(stats);
    }
}
