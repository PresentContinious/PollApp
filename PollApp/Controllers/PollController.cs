using Core.DAL;
using Core.DTOs;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PollApp.Controllers;

[ApiController]
[Route("api/poll")]
public class PollController : Controller
{
    public PollController(IUnitOfWork unitOfWork)
    {
        UnitOfWork = unitOfWork;
    }

    private IUnitOfWork UnitOfWork { get; }

    [HttpGet]
    public async Task<IResult> GetTests()
    {
        var polls = await UnitOfWork.TestRepository.GetAsync(null, null, "Questions.Answers");

        if (User.Identity is null)
            return Results.Json(new { polls });

        IDictionary<int, int> leftTries = new Dictionary<int, int>();

        var user = await UnitOfWork.UserRepository
            .GetFirstAsync(u => u.UserName == User.Identity.Name, "TestResults.Test");

        if (user is not null)
            leftTries = user.LeftTries;

        return Results.Json(new { polls, leftTries });
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IResult> GetTest(int id)
    {
        var test = await UnitOfWork.TestRepository.GetFirstAsync(t => t.Id == id, "Questions.Answers");
        return Results.Json(test);
    }

    [Authorize]
    [HttpPost]
    public async Task<IResult> TestResults([FromBody] TestResultsDto testDto)
    {
        var user = await UnitOfWork.UserRepository.GetFirstAsync(u => u.UserName == User.Identity!.Name,
            "TestResults.Test");
        if (user is null)
            return Results.NotFound();

        var test = await UnitOfWork.TestRepository.GetFirstAsync(t => t.Id == testDto.TestId);
        if (test is null)
            return Results.NotFound();

        var answerIds = testDto.Answers.SelectMany(a => a.AnswerIds);

        var answeredQuestions =
            (await UnitOfWork.AnswerRepository.GetAsync(a => answerIds.Contains(a.Id), null, "Question"))
            .Select(a => new AnsweredQuestion { Answer = a });

        var userResults = new UserResults
        {
            Score = answeredQuestions.Sum(a => a.Answer!.Weight),
            Date = DateTime.Now,
            Test = test,
            Questions = answeredQuestions.ToList()
        };

        user.TestResults.Add(userResults);

        await UnitOfWork.UserRepository.UpdateAsync(user);
        await UnitOfWork.SaveAsync();

        return Results.Json(new { userResults, left = user.LeftTries[testDto.TestId] });
    }
}
