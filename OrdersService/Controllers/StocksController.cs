using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrdersService.Data;
using OrdersService.Models;

namespace OrdersService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StocksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StocksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
    {
        return await _context.Stocks.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Stock>> GetStock(int id)
    {
        var stock = await _context.Stocks.FindAsync(id);

        if (stock == null)
        {
            return NotFound();
        }

        return stock;
    }

    [HttpGet("Barcode/{barcode}")]
    public async Task<ActionResult<Stock>> GetStockByBarcode(string barcode)
    {
        var stock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.Barcode == barcode);

        if (stock == null)
        {
            return NotFound();
        }

        return stock;
    }

    [HttpPost]
    public async Task<ActionResult<Stock>> PostStock(Stock stock)
    {
        if (await _context.Stocks.AnyAsync(s => s.Barcode == stock.Barcode))
        {
            return Conflict(new { message = "Barcode already exists" });
        }

        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStock), new { id = stock.StockId }, stock);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutStock(int id, Stock stock)
    {
        if (id != stock.StockId)
        {
            return BadRequest();
        }

        if (await _context.Stocks.AnyAsync(s => s.Barcode == stock.Barcode && s.StockId != id))
        {
            return Conflict(new { message = "Barcode already exists" });
        }

        _context.Entry(stock).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StockExists(id))
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
    public async Task<IActionResult> DeleteStock(int id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null)
        {
            return NotFound();
        }

        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StockExists(int id)
    {
        return _context.Stocks.Any(e => e.StockId == id);
    }
}
