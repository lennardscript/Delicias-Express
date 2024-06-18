using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models.Users;

public class UserModel : IdentityUser
{
    [Required]
    [StringLength(100, ErrorMessage = "El nombre/razón social es demasiado largo")]
    public string Nombre { get; set; }
    [Required]
    [StringLength(100, ErrorMessage = "La dirección es demasiado larga")]
    public string Direccion { get; set; }
    [Required]
    [StringLength(20, ErrorMessage = "El teléfono es demasiado largo")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Teléfono no válido.")]
    public string Telefono { get; set; }
    
}