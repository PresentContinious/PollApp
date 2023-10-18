using System.Dynamic;
using Core.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using File = Google.Apis.Drive.v3.Data.File;

namespace Core.Services;

public class GoogleDriveService : IDriveService
{
    private DriveService DriveService { get; }

    public GoogleDriveService(IConfiguration configuration)
    {
        var driveAuth = configuration.GetSection("googleAuth");

        var tokenResponse = new TokenResponse
        {
            AccessToken = driveAuth["accessToken"],
            RefreshToken = driveAuth["refreshToken"]
        };

        var applicationName = driveAuth["applicationName"];
        var username = driveAuth["username"];

        var apiCodeFlow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = driveAuth["clientId"],
                ClientSecret = driveAuth["clientSecret"],
            },
            Scopes = new[] { DriveService.Scope.Drive },
            DataStore = new FileDataStore(applicationName)
        });

        var credential = new UserCredential(apiCodeFlow, username, tokenResponse);

        var service = new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = applicationName,
        });

        DriveService = service;
    }

    public async Task<string> CreateFolder(string folderName, params string[] parents)
    {
        var driveFolder = new File
        {
            Name = folderName,
            MimeType = "application/vnd.google-apps.folder",
            Parents = parents
        };
        var command = DriveService.Files.Create(driveFolder);
        var file = await command.ExecuteAsync();
        return file.Id;
    }

    public async Task<string> UploadFile(Stream file, string fileName, string fileMime, string folder)
    {
        var driveFile = new File
        {
            Name = fileName,
            MimeType = fileMime,
            Parents = new[] { folder }
        };

        var request = DriveService.Files.Create(driveFile, file, fileMime);
        request.Fields = "id";

        var response = await request.UploadAsync();
        if (response.Status != Google.Apis.Upload.UploadStatus.Completed)
            throw response.Exception;

        return request.ResponseBody.Id;
    }

    public async Task SaveFileIdAsync(string fileId)
    {
        var appSettingsPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
        var json = await System.IO.File.ReadAllTextAsync(appSettingsPath);

        var jsonSettings = new JsonSerializerSettings();
        jsonSettings.Converters.Add(new ExpandoObjectConverter());
        jsonSettings.Converters.Add(new StringEnumConverter());

        dynamic config = JsonConvert.DeserializeObject<ExpandoObject>(json, jsonSettings)!;

        config.googleAuth.rootFileId = fileId;

        var newJson = JsonConvert.SerializeObject(config, Formatting.Indented, jsonSettings);

        await System.IO.File.WriteAllTextAsync(appSettingsPath, newJson);
    }
}
