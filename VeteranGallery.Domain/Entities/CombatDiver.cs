namespace VeteranGallery.Domain.Entities;

public class CombatDiver : NavyVeteran
{
    public int DivingDepthRating { get; set; }
    public int UnderwaterMissions { get; set; }

    public override string GetSpecializedDescription()
        => $"Combat Diver. Max Depth: {DivingDepthRating} m. Underwater Missions: {UnderwaterMissions}. {GetNavySummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} Combat Diver".Trim();
}
