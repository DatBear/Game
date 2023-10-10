using FluentMigrator;

namespace NetCoreGameServer.Migrations.Migrations;

[Migration(1687012000)]
public class Init : Migration {
    public override void Up()
    {
        Execute.Sql(@"
        create table `Character`
        (
            Id             int auto_increment
                primary key,
            UserId         int             not null,
            Name           varchar(255)    not null,
            Level          int default 1   not null,
            ClassId        int default 0   null,
            Gender         int default 0   not null,
            Core           int default 0   not null,
            Life           int default 100 not null,
            Mana           int default 100 not null,
            Experience     int default 0   not null,
            StatPoints     int default 10  not null,
            AbilityPoints  int default 0   not null,
            EquipmentSlots int default 8   not null,
            Kills          int default 0   not null,
            Deaths         int default 0   not null,
            StatsId        int             not null
        );

        create table CharacterClass
        (
            Id   int
                primary key,
            Name varchar(255) not null
        );

        alter table `Character`
            add constraint Character_CharacterClass_Id_fk
                foreign key (ClassId) references CharacterClass (Id);

        create table Stats
        (
            Id             int auto_increment
                primary key,
            EnhancedEffect int default 0 not null,
            Strength       int default 0 not null,
            Dexterity      int default 0 not null,
            Vitality       int default 0 not null,
            Intelligence   int default 0 not null,
            MaxLife        int default 0 not null,
            MaxMana        int default 0 not null,
            ExperienceGained int default 0 not null,
            MagicLuck int default 0 not null,
            LifeRegen int default 0 not null,
            ManaRegen int default 0 not null,
            ExtraEquipmentSlots int default 0 not null,
            CriticalStrike int default 0 not null,
            LifePerAttack int default 0 not null,
            ManaPerAttack int default 0 not null,
            LifePerKill int default 0 not null,
            ManaPerKill int default 0 not null,
            LifeSteal int default 0 not null,
            DamageReturn int default 0 not null,
            MindNumb int default 0 not null,
            ArmorPierce int default 0 not null,
            Parry int default 0 not null,
            CriticalFlux int default 0 not null,
            PhysicalDamageReduction int default 0 not null,
            MagicalDamageReduction int default 0 not null,
            ManaSiphon int default 0 not null,
            QuickDraw int default 0 not null,
            ManaConsumption int default 0 not null,
            IceMastery int default 0 not null,
            FireMastery int default 0 not null,
            LightningMastery int default 0 not null,
            EarthMastery int default 0 not null,
            WindMastery int default 0 not null,
            HealMastery int default 0 not null,
            ManaSkin int default 0 not null,
            PowerShot int default 0 not null,
            GlancingBlow int default 0 not null,
            Jubilance int default 0 not null
        );

        create table ItemStats
        (
            Id             int auto_increment
                primary key,
            EnhancedEffect int default 0 not null,
            Strength       int default 0 not null,
            Dexterity      int default 0 not null,
            Vitality       int default 0 not null,
            Intelligence   int default 0 not null,
            MaxLife        int default 0 not null,
            MaxMana        int default 0 not null,
            ExperienceGained int default 0 not null,
            MagicLuck int default 0 not null,
            LifeRegen int default 0 not null,
            ManaRegen int default 0 not null,
            ExtraEquipmentSlots int default 0 not null,
            CriticalStrike int default 0 not null,
            LifePerAttack int default 0 not null,
            ManaPerAttack int default 0 not null,
            LifePerKill int default 0 not null,
            ManaPerKill int default 0 not null,
            LifeSteal int default 0 not null,
            DamageReturn int default 0 not null,
            MindNumb int default 0 not null,
            ArmorPierce int default 0 not null,
            Parry int default 0 not null,
            CriticalFlux int default 0 not null,
            PhysicalDamageReduction int default 0 not null,
            MagicalDamageReduction int default 0 not null,
            ManaSiphon int default 0 not null,
            QuickDraw int default 0 not null,
            ManaConsumption int default 0 not null,
            IceMastery int default 0 not null,
            FireMastery int default 0 not null,
            LightningMastery int default 0 not null,
            EarthMastery int default 0 not null,
            WindMastery int default 0 not null,
            HealMastery int default 0 not null,
            ManaSkin int default 0 not null,
            PowerShot int default 0 not null,
            GlancingBlow int default 0 not null,
            Jubilance int default 0 not null,
            WarmLights int default 0 not null,
            EvilPresences int default 0 not null,
            TreasureChests int default 0 not null,
            Rooms int default 0 not null,
            WarmLightEffectiveness int default 0 not null,
            MonsterDifficulty int default 0 not null,
            ItemDrops int default 0 not null,
            ItemQuantity int default 0 not null,
            Swarm int default 0 not null,
            GuildPoints int default 0 not null,
            LevelUp int default 0 not null,
            LevelCap int default 0 not null
        );

        create table Item
        (
            Id           int auto_increment
                primary key,
            Tier         int default 1 not null,
            Quantity     int           null,
            SubType      int           not null,
            ItemStatsId  int           not null,
            Position     int           null,
            EquippedItemSlot int           null,
            OwnerId      int           not null,
            constraint Item_Character_Id_fk
                foreign key (OwnerId) references `Character` (Id),
            constraint Item_ItemStats_fk
                foreign key (ItemStatsId) references ItemStats (Id)
        );


        alter table `Character`
            add constraint Character_Stats_Id_fk
                foreign key (StatsId) references Stats (Id);

        create table User
        (
            Id       int auto_increment
                primary key,
            Email    varchar(191) not null,
            Password varchar(191) not null,
            Username varchar(191) not null
        )
            collate = utf8mb4_unicode_ci;

        alter table `Character`
            add constraint Character_User_Id_fk
                foreign key (UserId) references User (Id);

        alter table User
            add constraint User_Username_key
                unique (Username);

#        create table CharacterInventoryItem
#        (
#            CharacterId int not null,
#            ItemId      int not null,
#            Position    int not null,
#            constraint CharacterInventoryItem_pk
#                primary key (CharacterId, Itemid),
#            constraint CharacterInventoryItem_Character_fk
#                foreign key (CharacterId) references `Character` (Id),
#            constraint CharacterInventoryItem_Item_fk
#                foreign key (ItemId) references Item (Id)
#        );
#
#        create table CharacterInventoryEquipment
#        (
#            CharacterId int not null,
#            ItemId      int not null,
#            Position    int not null,
#            constraint CharacterInventoryEquipment_pk
#                primary key (CharacterId, Itemid),
#            constraint CharacterInventoryEquipment_Character_fk
#                foreign key (CharacterId) references `Character` (Id),
#            constraint CharacterInventoryEquipment_Item_fk
#                foreign key (ItemId) references Item (Id)
#        );
#
#        create table CharacterEquippedItem
#        (
#            CharacterId int not null,
#            ItemId      int not null,
#            Slot        int not null,
#            constraint CharacterEquippedItem_pk
#                primary key (CharacterId, Itemid),
#            constraint CharacterEquippedItem_Character_Id_fk
#                foreign key (CharacterId) references `Character` (Id),
#            constraint CharacterEquippedItem_Item_Id_fk
#                foreign key (ItemId) references Item (Id)
#        );
        ");
    }

    public override void Down()
    {
        Execute.Sql(@"
            drop table Item;
            drop table `Character`;
            drop table CharacterClass;
            drop table Stats;
            drop table User;
            drop table ItemStats;
        ");
    }
}