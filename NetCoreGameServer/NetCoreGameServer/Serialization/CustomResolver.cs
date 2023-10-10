using System.Reflection;
using NetCoreGameServer.Data.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NetCoreGameServer.Serialization;

public class CustomResolver : CamelCasePropertyNamesContractResolver
{
    protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
    {
        var prop = base.CreateProperty(member, memberSerialization);
        if (prop.DeclaringType == typeof(Stats) || prop.DeclaringType == typeof(ItemStats))
        {
            prop.DefaultValueHandling = DefaultValueHandling.Ignore;
        }
        return prop;
    }
}