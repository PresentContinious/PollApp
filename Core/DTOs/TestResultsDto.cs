namespace Core.DTOs;

public class TestResultsDto
{
    public int TestId { get; set; }

    public IEnumerable<AnswersDto> Answers { get; set; } = new List<AnswersDto>();
}

public class AnswersDto
{
    public int QuestionId { get; set; }
    public int[] AnswerIds { get; set; }
}
