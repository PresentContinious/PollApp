using Microsoft.AspNetCore.Identity;

namespace DataAccess.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public List<UserResults> TestResults { get; set; } = new();

    public IDictionary<int, int> LeftTries => TestResults
        .GroupBy(t => t.Test!)
        .Select(a => new
        {
            Count = a.Key.MaxTries - a.Count(),
            TestId = a.Key.Id
        })
        .ToDictionary(e => e.TestId, e => e.Count);
}
