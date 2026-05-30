namespace VeteranGallery.Domain.Interfaces;

public interface IVehicleOperator
{
    string VehicleModel { get; set; }

    string GetOperationalSummary();
}