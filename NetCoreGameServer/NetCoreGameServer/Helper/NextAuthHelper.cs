using System.Security.Cryptography;
using System.Text;
using Jose;
using Microsoft.Extensions.Options;
using NetCoreGameServer.Data.Config;
using NetCoreGameServer.Data.Model;
using Newtonsoft.Json;

namespace NetCoreGameServer.Helper;

public class NextAuthHelper
{
    private static byte[] NextAuthKeyInfo = Encoding.Default.GetBytes("NextAuth.js Generated Encryption Key");

    private readonly NextAuthConfig _config;

    public NextAuthHelper(IOptions<NextAuthConfig> config)
    {
        _config = config.Value;
    }

    public GameJWT? GetJwt(string token)
    {
        var decryptionKey = HKDF.DeriveKey(HashAlgorithmName.SHA256, Encoding.Default.GetBytes(_config.Secret), 32, null, NextAuthKeyInfo);
        var json = JWE.Decrypt(token, decryptionKey, JweAlgorithm.DIR, JweEncryption.A256GCM);
        return JsonConvert.DeserializeObject<GameJWT>(json.Plaintext);
    }
}