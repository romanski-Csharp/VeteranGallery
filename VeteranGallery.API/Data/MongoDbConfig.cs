using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using VeteranGallery.Domain.Entities;

namespace VeteranGallery.API.Data;

public static class MongoDbConfig
{
    private static bool _isInitialized = false;
    private static readonly object _lock = new object();

    public static void Initialize()
    {
        if (_isInitialized) return;

        lock (_lock)
        {
            if (_isInitialized) return;

            BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

            BsonClassMap.RegisterClassMap<Veteran>(cm =>
            {
                cm.AutoMap();
                cm.SetIsRootClass(true);
                cm.AddKnownType(typeof(LandForcesVeteran));
                cm.AddKnownType(typeof(AirForceVeteran));
                cm.AddKnownType(typeof(NavyVeteran));
                cm.AddKnownType(typeof(AirAssaultVeteran));
                cm.AddKnownType(typeof(SpecialOpsVeteran));
                cm.AddKnownType(typeof(Infantryman));
                cm.AddKnownType(typeof(Artillery));
                cm.AddKnownType(typeof(TankCrewman));
                cm.AddKnownType(typeof(Pilot));
                cm.AddKnownType(typeof(AirDefenseOperator));
                cm.AddKnownType(typeof(FlightNavigator));
                cm.AddKnownType(typeof(DroneOperator));
                cm.AddKnownType(typeof(Paratrooper));
                cm.AddKnownType(typeof(AirAssaultSapper));
                cm.AddKnownType(typeof(NavySailor));
                cm.AddKnownType(typeof(CombatDiver));
                cm.AddKnownType(typeof(NavalArtillerist));
                cm.AddKnownType(typeof(SpecialForcesSoldier));
                cm.AddKnownType(typeof(Sniper));
                cm.AddKnownType(typeof(SpecialOpsIntelligence));
            });

            BsonClassMap.RegisterClassMap<LandForcesVeteran>(cm =>
            {
                cm.AutoMap();
                cm.AddKnownType(typeof(Infantryman));
                cm.AddKnownType(typeof(Artillery));
                cm.AddKnownType(typeof(TankCrewman));
            });

            BsonClassMap.RegisterClassMap<AirForceVeteran>(cm =>
            {
                cm.AutoMap();
                cm.AddKnownType(typeof(Pilot));
                cm.AddKnownType(typeof(AirDefenseOperator));
                cm.AddKnownType(typeof(FlightNavigator));
            });

            BsonClassMap.RegisterClassMap<NavyVeteran>(cm =>
            {
                cm.AutoMap();
                cm.AddKnownType(typeof(NavySailor));
                cm.AddKnownType(typeof(CombatDiver));
                cm.AddKnownType(typeof(NavalArtillerist));
            });

            BsonClassMap.RegisterClassMap<AirAssaultVeteran>(cm =>
            {
                cm.AutoMap();
                cm.AddKnownType(typeof(DroneOperator));
                cm.AddKnownType(typeof(Paratrooper));
                cm.AddKnownType(typeof(AirAssaultSapper));
            });

            BsonClassMap.RegisterClassMap<SpecialOpsVeteran>(cm =>
            {
                cm.AutoMap();
                cm.AddKnownType(typeof(SpecialForcesSoldier));
                cm.AddKnownType(typeof(Sniper));
                cm.AddKnownType(typeof(SpecialOpsIntelligence));
            });

            BsonClassMap.RegisterClassMap<Artillery>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<TankCrewman>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<AirDefenseOperator>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<FlightNavigator>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<CombatDiver>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<NavalArtillerist>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<Paratrooper>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<AirAssaultSapper>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<Sniper>(cm => cm.AutoMap());
            BsonClassMap.RegisterClassMap<SpecialOpsIntelligence>(cm => cm.AutoMap());

            _isInitialized = true;
        }
    }
}