using System.Data;
using Dapper;
using NetCoreGameServer.Data;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class UserService
{
    private readonly IDbConnection _db;

    public UserService(IDbConnection db)
    {
        _db = db;
    }

    public User? GetUser(int id)
    {
        return _db.QueryFirst<User>($"SELECT Id, Username, Email FROM {TableNames.User} WHERE Id = @Id", new { Id = id });
    }

    public User? GetUserDetails(int id)
    {
        var chars = new List<Character>();
        return _db.Query<User, Character, Stats, User>(@$"SELECT
                u.*
                , c.*, cc.Name as Class
                , s.*
            FROM {TableNames.User} u
            LEFT JOIN {TableNames.Character} c ON c.UserId = u.Id
            LEFT JOIN {TableNames.CharacterClass} cc ON c.ClassId = cc.Id
            LEFT JOIN {TableNames.Stats} s ON c.StatsId = s.Id
        ", (u, c, s) =>
        {
            chars.Add(c);
            c.Stats = s;
            u.Characters = chars;
            return u;
        }, new { Id = id }).FirstOrDefault();
    }
}