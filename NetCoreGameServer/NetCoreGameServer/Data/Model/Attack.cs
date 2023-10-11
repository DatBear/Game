namespace NetCoreGameServer.Data.Model;

public class Attack
{
    public long Timestamp { get; set; }
    public int SourceId { get; set; }
    public int TargetId { get; set; }
    public AttackType Type { get; set; }
    public int Damage { get; set; }
    public bool IsCritical { get; set; }
    public int TargetHealthResult { get; set; }
    public EquippedItemSlot EquippedItemSlot { get; set; }
    public ItemSubType? WeaponType { get; set; }
}