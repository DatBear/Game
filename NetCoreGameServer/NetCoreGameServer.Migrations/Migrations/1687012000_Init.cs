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
            Id   int auto_increment
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
            MaxMana        int default 0 not null
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
        ");
    }

    public override void Down()
    {
        Execute.Sql(@"
        drop table `Character`;

        drop table CharacterClass;

        drop table Stats;

        drop table User;
        ");
    }
}