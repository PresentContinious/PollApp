using System.Linq.Expressions;
using DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories.Operations;

public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public GenericRepository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public async Task<IEnumerable<TEntity>> GetAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params string[] includeProperties)
    {
        IQueryable<TEntity> query = _dbSet;

        if (filter is not null)
            query = query.Where(filter);

        query = includeProperties.Aggregate(query, (current, includeProperty)
            => current.Include(includeProperty));

        return await (orderBy is not null ? orderBy(query).ToListAsync() : query.ToListAsync());
    }

    public async Task<TEntity?> GetFirstAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties)
    {
        IQueryable<TEntity> query = _dbSet;

        if (filter is not null)
            query = query.Where(filter);

        query = includeProperties.Aggregate(query, (current, includeProperty)
            => current.Include(includeProperty));

        return await query.FirstOrDefaultAsync();
    }

    public async Task<TEntity?> GetFirstNoTrackingAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties)
    {
        IQueryable<TEntity> query = _dbSet;

        if (filter is not null)
            query = query.AsNoTracking().Where(filter);

        query = includeProperties.Aggregate(query, (current, includeProperty)
            => current.Include(includeProperty));

        return await query.FirstOrDefaultAsync();
    }

    public async Task<TEntity?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task InsertAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entityToDelete = await _dbSet.FindAsync(id);

        if (entityToDelete is null)
            return;

        await DeleteAsync(entityToDelete);
    }

    public async Task DeleteAsync(TEntity entityToDelete)
    {
        if (_context.Entry(entityToDelete).State == EntityState.Detached)
            _dbSet.Attach(entityToDelete);

        await Task.Run(() => _dbSet.Remove(entityToDelete));
    }

    public async Task UpdateAsync(TEntity entityToUpdate)
    {
        await Task.Run(() => _dbSet.Update(entityToUpdate));
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
