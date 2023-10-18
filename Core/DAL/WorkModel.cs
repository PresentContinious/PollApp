using Core.Interfaces;
using Core.Services;
using DataAccess;
using DataAccess.Models;
using DataAccess.Repositories.Interfaces;
using DataAccess.Repositories.Operations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Core.DAL;

public class WorkModel : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public WorkModel(ApplicationDbContext dbContext, UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _context = dbContext;
        UserAuthentication = new UserAuthenticationRepository(userManager, roleManager, configuration);
        UserRepository = new GenericRepository<User>(_context);
        TestRepository = new GenericRepository<Test>(_context);
        QuestionRepository = new GenericRepository<Question>(_context);
        AnswerRepository = new GenericRepository<Answer>(_context);
    }

    public IGenericRepository<Answer> AnswerRepository { get; }
    public IGenericRepository<Question> QuestionRepository { get; }
    public IGenericRepository<Test> TestRepository { get; }
    public IGenericRepository<User> UserRepository { get; }
    public IUserAuthenticationRepository UserAuthentication { get; }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }

    private bool _disposed;

    private void Dispose(bool disposing)
    {
        if (!_disposed)
            if (disposing)
                _context.Dispose();

        _disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
