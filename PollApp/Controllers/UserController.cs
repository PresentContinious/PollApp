using Core.DAL;
using Core.DTOs;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace PollApp.Controllers;

[Authorize]
[ApiController]
[Route("api/user/[action]")]
public class UserController : Controller
{
    private IUnitOfWork WorkModel { get; }

    public UserController(IUnitOfWork workModel)
    {
        WorkModel = workModel;
    }

    [HttpPost]
    [ActionName("sign-up")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUp([FromBody] UserRegistrationDto userRegistration)
    {
        IdentityResult userResult;
        if (userRegistration.Email == "admin@email.com")
            userResult = await WorkModel.UserAuthentication.RegisterAdminAsync(userRegistration);
        else
            userResult = await WorkModel.UserAuthentication.RegisterUserAsync(userRegistration);

        return !userResult.Succeeded
            ? BadRequest(userResult)
            : await SignIn(new UserLoginDto
                { Email = userRegistration.Email, Password = userRegistration.Password });
    }

    [HttpPost]
    [ActionName("sign-in")]
    [AllowAnonymous]
    public async Task<IActionResult> SignIn([FromBody] UserLoginDto userLogin)
    {
        var res = WorkModel.UserAuthentication.ValidateUser(userLogin, out User? user);

        return res
            ? Ok(new { Token = await WorkModel.UserAuthentication.CreateTokenAsync(user!) })
            : BadRequest("Invalid username or password");
    }

    [HttpGet]
    [ActionName("me")]
    public async Task<IActionResult> GetUser()
    {
        var userName = User.Identity?.Name;
        var user = await WorkModel.UserRepository
            .GetFirstAsync(u => u.UserName == userName,
                "TestResults.Test",
                "TestResults.Questions.Answer.Question");

        return user is null ? Redirect("/sign-in") : Json(new { user });
    }
}
