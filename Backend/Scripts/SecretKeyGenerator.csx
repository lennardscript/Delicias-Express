public class SecretKeyGenerator
{
    private static readonly System.Random Random = new System.Random();
    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    public static string GenerateSecretKey(int length)
    {
        return new string(System.Linq.Enumerable.Repeat(Chars, length)
            .Select(s => s[Random.Next(s.Length)]).ToArray());
    }
}

var secretKey = SecretKeyGenerator.GenerateSecretKey(32);
System.Console.WriteLine($"Your new JWT secret key is: {secretKey}");