using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BigBikeBlitz.Models;
using BigBikeBlitz.Data;
using BigBikeBlitz.Interfaces;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BigBikeBlitz.Controllers
{
	[Route("bike")]
	[ApiController]
	public class BikeController : ControllerBase
	{
		private readonly IBikeRepository _bikeRepository;

        public BikeController(IBikeRepository bikeRepository)
        {
			_bikeRepository = bikeRepository;
        }

		[HttpGet("getAll")]
		public JsonResult getAll()
		{
			var bikes = _bikeRepository.getAll();

			if(!ModelState.IsValid)
			{
				return new JsonResult(BadRequest());
			}

			return new JsonResult(Ok(bikes));
		}

		[HttpGet("getById")]
		public JsonResult getById(int id)
		{
			var bike = _bikeRepository.getById(id);

			if (!ModelState.IsValid)
			{
				return new JsonResult(BadRequest());
			}

			if(bike == null)
			{
				return new JsonResult(NotFound());
			}

			return new JsonResult(Ok(bike));
		}

		[HttpPost("create")]
		public JsonResult createBike(Bike bike)
		{
			if (!ModelState.IsValid)
			{
				return new JsonResult(BadRequest()); ;
			}

			var newBike = _bikeRepository.createBike(bike);

			if (newBike == 1)
			{
				return new JsonResult(NotFound("User with id = " + bike.UserId + " not found!"));
			}
			else if(newBike == -1)
			{
				return new JsonResult(BadRequest("Error when creating a new bike!"));
			}
			else
			{
				return new JsonResult(Ok("Create a new bike successfully!" + bike));
			}
		}
	}
}
