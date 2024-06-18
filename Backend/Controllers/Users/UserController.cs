using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Backend.Models.Users;
using Backend.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Users;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController : Controller
{
    private readonly UserService _userService;
    private readonly IConfiguration _configuration;

    public UserController(UserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    public class RegisterModel : UserModel
    {
        [Required] public string Password { get; set; }
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

    [HttpGet("username")]
    public async Task<IActionResult> GetUserName()
    {
        var user = await _userService.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "No user is currently logged in" });
        }

        return Ok(new { user.Nombre });
    }

    private string GenerateAuthToken(UserModel user)
    {
        var jwtSecretKey = _configuration["JWT_SECRET_KEY"];
        var key = Encoding.ASCII.GetBytes(jwtSecretKey);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // private string GenerateAuthToken(UserModel user)
    // {
    //     var tokenHandler = new JwtSecurityTokenHandler();
    //     var jwtSecretKey = _configuration["JWT_SECRET_KEY"];
    //     Console.WriteLine($"JWT_SECRET_KEY: {jwtSecretKey}");
    //     
    //     var key = Encoding.ASCII.GetBytes(jwtSecretKey);
    //     
    //     Console.WriteLine($"Key: {key}");
    //     
    //     var tokenDescriptor = new SecurityTokenDescriptor
    //     {
    //         Subject = new ClaimsIdentity(new Claim[]
    //         {
    //             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    //         }),
    //         Expires = DateTime.UtcNow.AddDays(7), // Token expires in 7 days
    //         SigningCredentials =
    //             new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    //     };
    //     Console.WriteLine($"TokenDescriptor: {tokenDescriptor}");
    //     
    //     var token = tokenHandler.CreateToken(tokenDescriptor);
    //     
    //     Console.WriteLine($"Token: {token}");
    //     return tokenHandler.WriteToken(token);
    // }
}