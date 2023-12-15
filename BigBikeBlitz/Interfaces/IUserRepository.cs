using BigBikeBlitz.Models;

namespace BigBikeBlitz.Interfaces
{
	public interface IUserRepository
	{
		ICollection<User> getAll();
		User getById(int userId);
		bool isUserExist(int userId);
		bool createUser(User user);
		bool deleteUser(int userId);
		int editUser(User user);
	}
}
