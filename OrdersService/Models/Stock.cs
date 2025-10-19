namespace OrdersService.Models;

public class Stock
{
    public int StockId { get; set; }
    public string StockName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Barcode { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
