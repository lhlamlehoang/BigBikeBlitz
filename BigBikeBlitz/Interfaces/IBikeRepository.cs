using BigBikeBlitz.Models;
using Microsoft.AspNetCore.Mvc;

namespace BigBikeBlitz.Interfaces
{
	public interface IBikeRepository
	{
		IEnumerable<object> getAll();
		IEnumerable<object> getById(int bikeId);
		bool isBikeExist(int bikeId);
		int createBike(Bike bike);
	}
}
