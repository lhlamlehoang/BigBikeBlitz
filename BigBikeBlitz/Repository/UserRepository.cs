using BigBikeBlitz.Interfaces;
using BigBikeBlitz.Models;
using BigBikeBlitz.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BigBikeBlitz.Repository
{
	public class UserRepository : IUserRepository
	{
		private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool createUser(User user)
		{
			try
			{
				_context.Users.Add(user);
				_context.SaveChanges();
				return true;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.ToString());
				return false;
			}
		}

		public ICollection<User> getAll()
		{
			var users = _context.Users.Include(u => u.Bikes).ToList();
			return users;
		}

		public User getById(int userId)
		{
			var user = _context.Users.Include(u => u.Bikes).FirstOrDefault(u => u.userId == userId);
			return user;
		}

		public bool isUserExist(int userId)
		{
			throw new NotImplementedException();
		}

		public bool deleteUser(int userId) 
		{
			try
			{
				var user = _context.Users.Find(userId);

				if (user != null)
				{
					_context.Users.Remove(user);
					_context.SaveChanges();
					return true;
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.ToString());
			}
			return false;
		}

		public int editUser(User user)
		{
			try
			{
				var userUpdate = _context.Users.Find(user.userId);

				if (userUpdate == null)
				{
					return 1;
				}
				userUpdate.userName = user.userName;
				userUpdate.avatar = user.avatar;

				_context.SaveChanges();
				return 0;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return -1;
			}
		}
	}
}
