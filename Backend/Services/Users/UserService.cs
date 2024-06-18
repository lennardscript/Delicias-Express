using System.Security.Claims;
using Backend.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services.Users;

public class UserService
{
    private readonly UserManager<UserModel> _userManager;
    private readonly SignInManager<UserModel> _signInManager;
    
    public UserService(UserManager<UserModel> userManager, SignInManager<UserModel> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<IdentityResult> RegisterAsync(UserModel user, string password)
    {
        return await _userManager.CreateAsync(user, password);
    }
    
    public async Task<UserModel> AuthenticateAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null && await _userManager.CheckPasswordAsync(user, password))
        {
            return user;
        }

        return null;
    }
    
    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }
    
    public async Task<UserModel> GetUserAsync(ClaimsPrincipal userPrincipal)
    {
        var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return null;
        }

        return await _userManager.FindByIdAsync(userId);
    }
}