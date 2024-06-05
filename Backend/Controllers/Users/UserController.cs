using System.ComponentModel.DataAnnotations;
using Backend.Models.Users;
using Backend.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Users;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController : Controller
{
    private readonly UserService _userService;
    
    public UserController(UserService userService)
    {
        _userService = userService;
    }
    
    public class RegisterModel : UserModel
    {
        [Required]
        public string Password { get; set; }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        model.UserName = model.Email;
        var result = await _userService.RegisterAsync(model, model.Password);

        if (result.Succeeded) return Ok();
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }
        return BadRequest(ModelState);

    }
    
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        var user = await _userService.AuthenticateAsync(model.Email, model.Password);
        
        if (user == null)
        {
            return BadRequest(new { message = "Email or password is incorrect" });
        }
        
        return Ok();
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _userService.LogoutAsync();
        return Ok();
    }
    
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userService.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "No user is currently logged in" });
        }
        return Ok(user);
    }
}