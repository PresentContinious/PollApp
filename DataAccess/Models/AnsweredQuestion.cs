namespace DataAccess.Models;

public class AnsweredQuestion
{
    public int Id { get; set; }

    public int AnswerId { get; set; }
    public Answer? Answer { get; set; }

    public int UserResultsId { get; set; }
    public UserResults? UserResults { get; set; }
}
