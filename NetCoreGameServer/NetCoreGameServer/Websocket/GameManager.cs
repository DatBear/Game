using System.Net;
using System.Net.Sockets;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Data.Network.Groups;
using Org.BouncyCastle.Bcpg;

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

    public void GroupBroadcast(GameSession session, IResponsePacket packet, bool excludeSender = false)
    {
        if (session.User.Group == null)
        {
            if (session.User != null)
            {
                GetSession(session.User.Id)?.Send(packet);
            }
            return;
        }

        var userIds = session.User.Group.Users.Select(x => x.User.Id);//.Where(x => !excludeSender || x != session.User.Id);
        foreach (var user in userIds)
        {
            var groupSession = GetSession(user);
            if (groupSession != null)
            {
                groupSession.Send(packet);
            }
        }
    }

    public void GroupBroadcast(GameSession session, Func<User, IResponsePacket?> packetResolver)
    {
        if (session.User.Group == null)
        {
            var packet = packetResolver(session.User);
            GetSession(session.User.Id)?.Send(packet);
            return;
        }
        var userIds = session.User.Group.Users.Select(x => x.User.Id);//.Where(x => !excludeSender || x != session.User.Id);
        foreach (var user in userIds)
        {
            var groupSession = GetSession(user);
            if (groupSession != null)
            {
                groupSession.Send(packetResolver(groupSession.User));
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

            GroupBroadcast(GetSession(group.Users.FirstOrDefault().User.Id), new JoinGroupResponse
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

        GroupBroadcast(GetSession(user.Id)!, new LeaveGroupResponse
        {
            Data = user.AsGroupUser().User
        });

        user.Group = null;
        group.Users.Remove(group.Users.FirstOrDefault(x => x.User.Id == user.Id!));

        if (user.Id == group.LeaderId && group.Users.Count(x => x.User.Id != group.LeaderId) > 0)
        {
            SetGroupLeader(GetSession(group.Users.FirstOrDefault().User.Id), group.Users.FirstOrDefault().User.Id);
        }
    }

    public void SetGroupLeader(GameSession session, int id)
    {
        
        session.User.Group.LeaderId = id;
        GroupBroadcast(session, new SetGroupLeader.SetGroupLeaderResponse()
        {
            Data = id
        });
    }


}