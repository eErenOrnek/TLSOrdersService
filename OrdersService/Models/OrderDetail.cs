namespace OrdersService.Models;

public class OrderDetail
{
    public int OrderDetailId { get; set; }
    public int OrderId { get; set; }
    public int StockId { get; set; }
    public decimal Amount { get; set; }
    public bool IsActive { get; set; } = true;

    public Order? Order { get; set; }
    public Stock? Stock { get; set; }
}
