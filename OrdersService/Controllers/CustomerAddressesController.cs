using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersService.Data;
using OrdersService.Models;

namespace OrdersService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomerAddressesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomerAddressesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerAddress>>> GetCustomerAddresses()
    {
        return await _context.CustomerAddresses
            .Include(ca => ca.Customer)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerAddress>> GetCustomerAddress(int id)
    {
        var customerAddress = await _context.CustomerAddresses
            .Include(ca => ca.Customer)
            .FirstOrDefaultAsync(ca => ca.AddressId == id);

        if (customerAddress == null)
        {
            return NotFound();
        }

        return customerAddress;
    }

    [HttpGet("Customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<CustomerAddress>>> GetCustomerAddressesByCustomer(int customerId)
    {
        return await _context.CustomerAddresses
            .Where(ca => ca.CustomerId == customerId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CustomerAddress>> PostCustomerAddress(CustomerAddress customerAddress)
    {
        _context.CustomerAddresses.Add(customerAddress);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomerAddress), new { id = customerAddress.AddressId }, customerAddress);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCustomerAddress(int id, CustomerAddress customerAddress)
    {
        if (id != customerAddress.AddressId)
        {
            return BadRequest();
        }

        _context.Entry(customerAddress).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CustomerAddressExists(id))
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
    public async Task<IActionResult> DeleteCustomerAddress(int id)
    {
        var customerAddress = await _context.CustomerAddresses.FindAsync(id);
        if (customerAddress == null)
        {
            return NotFound();
        }

        _context.CustomerAddresses.Remove(customerAddress);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CustomerAddressExists(int id)
    {
        return _context.CustomerAddresses.Any(e => e.AddressId == id);
    }
}
