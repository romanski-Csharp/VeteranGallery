using System.Text.Json.Serialization.Metadata;
using Scalar.AspNetCore;
using VeteranGallery.API.Data;
using VeteranGallery.Domain.Interfaces;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

MongoDbConfig.Initialize();

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
            policy.WithOrigins("http://localhost:58294", "https://localhost:5173", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<IVeteranRepository, MongoVeteranRepository>();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

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

app.MapFallbackToFile("/index.html");

app.Run();