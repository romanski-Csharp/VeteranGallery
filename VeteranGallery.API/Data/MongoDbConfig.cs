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
                cm.AddKnownType(typeof(Pilot));
                cm.AddKnownType(typeof(Infantryman));
                cm.AddKnownType(typeof(DroneOperator));

            });

            _isInitialized = true;
        }
    }
}