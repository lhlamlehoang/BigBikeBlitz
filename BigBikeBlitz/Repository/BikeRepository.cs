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

		public int editBike(Bike bike)
		{
			try
			{
				var bikeUpdate = _context.Bikes.Find(bike.bikeId);

				if (bikeUpdate == null)
				{
					return 1;
				}
			   ;
                bikeUpdate.bikeName = bike.bikeName;
				bikeUpdate.CC = bike.CC;
				bikeUpdate.price = bike.price;
				bikeUpdate.photo = bike.photo;
				bikeUpdate.date = bike.date;
				_context.SaveChanges();

				return 0;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return -1;
			}
		}

		public bool deleteBike(int bikeId)
		{
			try
			{
				var bike = _context.Bikes.Find(bikeId);

				if (bike != null)
				{
					_context.Bikes.Remove(bike);
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
	}
}
