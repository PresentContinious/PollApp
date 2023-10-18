using Core.DTOs;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;

namespace Core.Interfaces;

public interface IUserAuthenticationRepository
{
    Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);
    Task<IdentityResult> RegisterAdminAsync(UserRegistrationDto userRegistration);
    bool ValidateUser(UserLoginDto loginDto, out User? user);
    Task<string> CreateTokenAsync(User user);
}
