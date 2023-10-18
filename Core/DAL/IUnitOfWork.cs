using Core.Interfaces;
using DataAccess.Models;
using DataAccess.Repositories.Interfaces;

namespace Core.DAL;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Answer> AnswerRepository { get; }
    IGenericRepository<Question> QuestionRepository { get; }
    IGenericRepository<Test> TestRepository { get; }
    IGenericRepository<User> UserRepository { get; }
    IUserAuthenticationRepository UserAuthentication { get; }
    Task SaveAsync();
}
