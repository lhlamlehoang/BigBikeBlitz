using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BigBikeBlitz.Models
{
	public class User
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int userId { get; set; }
		public string userName { get; set; }
		public string email { get; set; }
		public string password { get; set; }
		public string avatar { get; set; }
		public int role { get; set; }
		public ICollection<Bike> Bikes { get; set; }
	}
}
