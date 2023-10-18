using DataAccess.Models;

namespace Core.DTOs;

public class UserRegistrationDto
{
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string Password { get; init; } = null!;
    public string Email { get; init; } = null!;
}
