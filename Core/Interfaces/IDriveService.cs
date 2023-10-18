namespace Core.Interfaces;

using File = Google.Apis.Drive.v3.Data.File;

public interface IDriveService
{
    Task<string> CreateFolder(string folderName, params string[] parents);
    Task<string> UploadFile(Stream file, string fileName, string fileMime, string folder);
    Task SaveFileIdAsync(string fileId);
}
