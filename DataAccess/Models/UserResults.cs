namespace DataAccess.Models;

public class UserResults
{
    public int Id { get; set; }

    public int Score { get; set; }

    public DateTime Date { get; set; }

    public int? Percentage => Score / Test?.MaxPoints * 100;

    public Test? Test { get; set; }

    public string UserId { get; set; } = null!;
    public User? User { get; set; }

    public IEnumerable<AnsweredQuestion> Questions { get; set; } = new List<AnsweredQuestion>();
}
