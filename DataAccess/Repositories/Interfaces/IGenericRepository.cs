using System.Linq.Expressions;

namespace DataAccess.Repositories.Interfaces;

public interface IGenericRepository<TEntity> : IDisposable
{
    Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params string[] includeProperties);

    Task<TEntity?> GetFirstAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties);

    Task<TEntity?> GetFirstNoTrackingAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties);

    Task<TEntity?> GetByIdAsync(int id);
    Task InsertAsync(TEntity entity);
    Task DeleteAsync(int id);
    Task DeleteAsync(TEntity entityToDelete);
    Task UpdateAsync(TEntity entityToUpdate);
}
