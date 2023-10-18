namespace DataAccess.Models;

public class Answer
{
    public int Id { get; set; }

    public int Weight { get; set; }
    public string Name { get; set; } = null!;

    public int QuestionId { get; set; }
    public Question? Question { get; set; }
}
