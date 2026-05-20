using System.Text.Json.Serialization.Metadata;
using VeteranGallery.API.Data;
using VeteranGallery.Domain.Interfaces;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver();
        options.JsonSerializerOptions.AllowOutOfOrderMetadataProperties = true;
    });

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:58294")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddSingleton<IVeteranRepository, JsonVeteranRepository>();

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
