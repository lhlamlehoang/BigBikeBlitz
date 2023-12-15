using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BigBikeBlitz.Models;
using BigBikeBlitz.Data;
using BigBikeBlitz.Interfaces;

namespace BigBikeBlitz.Controllers
{
	[Route("user")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
			_userRepository = userRepository;
        }

		[HttpPost("create")]
		public JsonResult createUser(User user) 
		{
			if (!ModelState.IsValid)
			{
				return new JsonResult(BadRequest());
			}

			if (!_userRepository.createUser(user))
			{
				return new JsonResult(BadRequest());
			}
			return new JsonResult(Ok(user));
		}

		[HttpGet("getAll")]
		public JsonResult getAllUser() 
		{
			var users = _userRepository.getAll();

			return new JsonResult(Ok(users));
		}

		[HttpDelete("delete")]
		public JsonResult deleteUser(int userId)
		{
			if (!ModelState.IsValid)
			{
				return new JsonResult(BadRequest());
			}

			if (!_userRepository.deleteUser(userId))
			{
				return new JsonResult(BadRequest());
			}
			return new JsonResult(Ok("Deleted user "+userId));
		}

		[HttpPut("edit")]
		public JsonResult updateUser(User user)
		{
			var userUpdate = _userRepository.editUser(user);

			if(userUpdate == 1)
			{
				return new JsonResult(NotFound("User with id " + user.userId + " not found!"));
			}
			else if(userUpdate == -1)
			{
				return new JsonResult(BadRequest("Error when editing user!"));
			}
			else
			{
				return new JsonResult(Ok("Edit user successfully!" + user));
			}
		}
	}
}
