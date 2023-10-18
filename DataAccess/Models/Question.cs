namespace DataAccess.Models;

public class Question
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string? FileId { get; set; }
    public string? FileName { get; set; }

    public bool IsComplex => CorrectAnswers > 1;
    public int CorrectAnswers => Answers.Count(a => a.Weight > 0);

    public int TestId { get; set; }
    public Test? Test { get; set; }

    public List<Answer> Answers { get; set; } = new();
}
