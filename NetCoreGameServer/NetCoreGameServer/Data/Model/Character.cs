﻿using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class Character
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Level { get; set; }
    public int ClassId { get; set; }
    public string @Class { get; set; }
    public Gender Gender { get; set; }
    public Core Core { get; set; }
    public int Life { get; set; }
    public int Mana { get; set; }
    public int Experience { get; set; }
    public int StatPoints { get; set; }
    public int AbilityPoints { get; set; }
    public int EquipmentSlots { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int StatsId { get; set; }

    public Stats Stats { get; set; }

    [JsonIgnore]
    public List<Item> AllItems = new();
    public List<Item> EquippedItems => AllItems.Where(x => x.EquippedItemSlot != null).ToList();
    public List<Item> Equipment => AllItems.Where(x => x.SubType < ItemSubType.Fish && x.EquippedItemSlot == null).ToList();
    public List<Item> Items => AllItems.Where(x => x.SubType >= ItemSubType.Fish).ToList();

    

    public int UserId { get; set; }

    //not persisted
    public Zone? Zone { get; set; }
    
}