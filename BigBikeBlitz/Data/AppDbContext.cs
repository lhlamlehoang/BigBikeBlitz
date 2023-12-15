using BigBikeBlitz.Models;
using Microsoft.EntityFrameworkCore;

namespace BigBikeBlitz.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{

		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			//modelBuilder.Entity<Bike>()
			//.HasOne(b => b.User)
			//.WithMany(u => u.Bikes)
			//.HasForeignKey(b => b.userId);

			base.OnModelCreating(modelBuilder);
		}

		public DbSet<User> Users { get; set; }
		public DbSet<Bike> Bikes { get; set; }
    }
}
