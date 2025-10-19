namespace OrdersService.Models;

public class Order
{
    public int OrderId { get; set; }
    public int CustomerId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public string OrderNo { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public decimal Tax { get; set; }
    public int DeliveryAddressId { get; set; }
    public int InvoiceAddressId { get; set; }
    public bool IsActive { get; set; } = true;

    public Customer? Customer { get; set; }
    public CustomerAddress? DeliveryAddress { get; set; }
    public CustomerAddress? InvoiceAddress { get; set; }
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
