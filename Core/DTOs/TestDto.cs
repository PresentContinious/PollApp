using Microsoft.AspNetCore.Http;

namespace Core.DTOs;

// public class TestRequest
// {
//     public string Test { get; set; } = null!;
//     public List<IFormFile> Files { get; set; } = new();
// }

public class TestDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int MaxTries { get; set; }

    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuestionDto
{
    public string Name { get; set; } = null!;
    public IFormFile? File { get; set; }
    public List<AnswerDto> Answers { get; set; } = new List<AnswerDto>();
}

public class FileDto
{
    public IFormFile? File { get; set; }
}

public class AnswerDto
{
    public string Name { get; set; } = null!;
    public int Weight { get; set; }
}
