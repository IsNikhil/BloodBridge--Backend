# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore
RUN dotnet publish LearningStarter.csproj -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Required for Render
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

CMD ["dotnet", "LearningStarter.dll"]
