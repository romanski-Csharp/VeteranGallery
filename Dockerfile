FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["VeteranGallery.API/VeteranGallery.API.csproj", "VeteranGallery.API/"]
COPY ["VeteranGallery.Domain/VeteranGallery.Domain.csproj", "VeteranGallery.Domain/"]
RUN dotnet restore "VeteranGallery.API/VeteranGallery.API.csproj"
COPY . .
WORKDIR "/src/VeteranGallery.API"
RUN dotnet publish "VeteranGallery.API.csproj" -c Release -o /app/publish /p:UseAppHost=false
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VeteranGallery.API.dll"]