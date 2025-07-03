# Use official .NET SDK image to build and run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY backend_mongo/*.csproj ./backend_mongo/
RUN dotnet restore ./backend_mongo/backend_mongo.csproj

# Copy everything else and build
COPY backend_mongo/. ./backend_mongo/
WORKDIR /src/backend_mongo
RUN dotnet publish -c Release -o /app/publish

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend_mongo.dll"]
