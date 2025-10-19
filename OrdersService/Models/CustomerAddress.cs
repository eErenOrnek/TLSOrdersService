namespace OrdersService.Models;

public class CustomerAddress
{
    public int AddressId { get; set; }
    public int CustomerId { get; set; }
    public string AddressType { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Town { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public Customer? Customer { get; set; }
}
