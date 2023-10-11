using System.Net;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Data.Network.Groups;

namespace NetCoreGameServer.Websocket;

public class GameManager
{
    private static int NextGroupId = 1;
    private readonly Dictionary<int, GameSession> _sessions = new();
    private readonly List<Group> _groups = new();

    public GameManager()
    {
    }

    public void SetSession(int userId, GameSession session)
    {
        _sessions[userId] = session;
    }

    public bool RemoveSession(int userId)
    {
        try
        {
            if (_sessions.TryGetValue(userId, out var session))
            {
                if (session.User != null && session.User.Group != null)
                {
                    RemoveUserFromGroup(session.User.Group, session.User);
                }

                if (_sessions.Remove(userId))
                {
                    session.Close((int)HttpStatusCode.Unauthorized);
                    return true;
                }
            }
        }
        catch
        {
            //do nothing
        }

        return false;
    }

    public GameSession? GetSession(int userId)
    {
        _sessions.TryGetValue(userId, out var session);
        return session;
    }

    public Group CreateGroup(Group group)
    {
        group.Id = NextGroupId++;
        _groups.Add(group);
        return group;
    }

    public bool RemoveGroup(Group group)
    {
        var existingGroup = _groups.FirstOrDefault(x => x.Id == group.Id);
        if (existingGroup != null)
        {
            return _groups.Remove(existingGroup);
        }

        return false;
    }

    public Group? FindGroup(int groupId)
    {
        return _groups.FirstOrDefault(x => x.Id == groupId);
    }

    public Character? FindCharacter(int characterId)
    {
        return _sessions.Values.Select(x => x.User).Where(x => x != null).SelectMany(x => x.Characters).FirstOrDefault(x => x.Id == characterId);
    }

    public List<Group> GetGroups()
    {
        return _groups;
    }

    public void GroupBroadcast(Group? group, IResponsePacket packet, User? fromUser = null)
    {
        if (group == null)
        {
            if (fromUser != null)
            {
                GetSession(fromUser.Id)?.Send(packet);
                
            }
            return;
        }
        var userIds = group.Users.Select(x => x.User.Id);
        foreach (var user in userIds)
        {
            var session = GetSession(user);
            if (session != null)
            {
                session.Send(packet);
            }
        }
    }

    public void AddUserToGroup(Group group, User user)
    {
        if (_sessions.TryGetValue(user.Id, out var session))
        {
            if (group == null)
            {
                session.SendError("Unable to join group.");
                return;
            }

            if (group.Users.Count >= 5)
            {
                session.SendError("That group is full.");
                return;
            }

            GroupBroadcast(group, new JoinGroupResponse
            {
                Data = session.User.AsGroupUser()
            });

            session.User.Group = group;
            group.Users.Add(session.User.AsGroupUser());

            session.Send(new CreateGroupResponse
            {
                Data = group
            });
        }
    }

    public void RemoveUserFromGroup(Group? group, User user)
    {
        if (group == null)
        {
            if (_sessions.TryGetValue(user.Id, out var session))
            {
                session.Send(new LeaveGroupResponse
                {
                    Data = session.User.AsGroupUser().User
                });
            }
            return;
        }

        if (group.Users.Count() == 1)
        {
            RemoveGroup(group);
        }

        GroupBroadcast(group, new LeaveGroupResponse
        {
            Data = user.AsGroupUser().User
        });

        user.Group = null;
        group.Users.Remove(group.Users.FirstOrDefault(x => x.User.Id == user.Id!));

        if (user.Id == group.LeaderId && group.Users.Count(x => x.User.Id != group.LeaderId) > 0)
        {
            SetGroupLeader(group, group.Users.FirstOrDefault().User.Id);
        }
    }

    public void SetGroupLeader(Group group, int id)
    {
        group.LeaderId = id;
        GroupBroadcast(group, new SetGroupLeader.SetGroupLeaderResponse()
        {
            Data = id
        });
    }


}