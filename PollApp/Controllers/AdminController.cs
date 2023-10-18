using Core.DAL;
using Core.DTOs;
using Core.Interfaces;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PollApp.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    public AdminController(IUnitOfWork workModel, IDriveService driveService, IConfiguration configuration)
    {
        WorkModel = workModel;
        DriveService = driveService;
        Configuration = configuration;
    }

    private IUnitOfWork WorkModel { get; }
    private IDriveService DriveService { get; }
    private IConfiguration Configuration { get; }

    [HttpPost]
    public async Task<IActionResult> CreateTest([FromForm] TestDto testDto)
    {
        testDto.Questions
            .ForEach(q => q.Answers = q.Answers.Where(a => !string.IsNullOrWhiteSpace(a.Name))
                .ToList());

        var rootFileId = Configuration.GetSection("googleAuth")["rootFileId"];
        if (string.IsNullOrEmpty(rootFileId))
        {
            rootFileId = await DriveService.CreateFolder("PollApp Photos");
            await DriveService.SaveFileIdAsync(rootFileId);
        }

        var questions = new List<Question>();
        var collection = testDto.Questions
            .Where(testDtoQuestion =>
                !string.IsNullOrWhiteSpace(testDtoQuestion.Name) &&
                testDtoQuestion.Answers.Count >= 2 &&
                testDtoQuestion.Answers.Any(a => a.Weight != 0));

        foreach (var testDtoQuestion in collection)
        {
            if (testDtoQuestion.File is null)
            {
                questions.Add(new Question
                {
                    Name = testDtoQuestion.Name,
                    Answers = testDtoQuestion.Answers
                        .Select(a => new Answer { Name = a.Name, Weight = a.Weight })
                        .ToList()
                });
                continue;
            }

            var fileId = await DriveService.UploadFile(testDtoQuestion.File.OpenReadStream(),
                testDtoQuestion.File.FileName,
                testDtoQuestion.File.ContentType,
                rootFileId);

            questions.Add(new Question
            {
                Name = testDtoQuestion.Name,
                FileId = fileId,
                FileName = testDtoQuestion.File.FileName,
                Answers = testDtoQuestion.Answers
                    .Select(a => new Answer { Name = a.Name, Weight = a.Weight })
                    .ToList()
            });
        }

        var test = new Test
        {
            Name = testDto.Name,
            Description = testDto.Description,
            MaxTries = testDto.MaxTries,
            MaxPoints = testDto.Questions.Sum(q => q.Answers.Sum(a => a.Weight)),
            Questions = questions
        };

        await WorkModel.TestRepository.InsertAsync(test);
        await WorkModel.SaveAsync();

        return Ok();
    }
}
