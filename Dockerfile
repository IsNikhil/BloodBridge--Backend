# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy everything
COPY . .

# Restore and publish
RUN dotnet publish LearningStarter.csproj -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# Render uses PORT environment variable
ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT
EXPOSE 10000
CMD ["dotnet", "LearningStarter.dll"]
