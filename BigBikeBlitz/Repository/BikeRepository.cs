using BigBikeBlitz.Models;
using BigBikeBlitz.Data;
using BigBikeBlitz.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace BigBikeBlitz.Repository
{
	public class BikeRepository : IBikeRepository
	{
		private readonly AppDbContext _context;

        public BikeRepository(AppDbContext context)
        {
            _context = context;
        }
        
        public IEnumerable<object> getAll()
        {
			var bikeUserList = _context.Bikes
					   .Select(bike => new
					   {
						   Bike = bike,
						   User = _context.Users.FirstOrDefault(u => u.userId == bike.UserId)
					   })
					   .ToList(); 
            return bikeUserList;
        }

        public bool isBikeExist(int bikeId)
        {
            var bike = _context.Bikes.Find(bikeId);

            if(bike == null)
            {
                return false;
            }
            return true;
        }

		public IEnumerable<object> getById(int bikeId)
		{
            var bikeUser = _context.Bikes
                       .Select(bike => new
                       {
                           Bike = bike,
                           User = _context.Users.FirstOrDefault(u => u.userId == bike.UserId)
                       });
			return bikeUser;
		}

        public int createBike(Bike bike)
        {
            try
            {
                var user = _context.Users.Find(bike.UserId);

                if(user == null)
                {
                    return 1;
                }
               ;
				var newBike = _context.Bikes.Add(bike);
                user.Bikes.Add(bike);
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
