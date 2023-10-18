namespace DataAccess.Models;

public class Test
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int MaxPoints { get; set; }
    public int MaxTries { get; set; }

    public List<Question> Questions { get; set; } = new();
}
