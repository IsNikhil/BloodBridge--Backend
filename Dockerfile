# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only csproj and restore early
COPY LearningStarter.csproj ./
RUN dotnet restore LearningStarter.csproj

# Copy all files
COPY . .

RUN dotnet publish LearningStarter.csproj -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Required for Render
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

CMD ["dotnet", "LearningStarter.dll"]
