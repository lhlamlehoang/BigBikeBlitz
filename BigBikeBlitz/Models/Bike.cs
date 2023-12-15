using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;

namespace BigBikeBlitz.Models
{
	public class Bike
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int bikeId { get; set; }
		public string bikeName { get; set; }
		public double CC { get; set; }
		public double price { get; set; }
		public string photo { get; set; }
		public int date { get; set; }
		public int UserId { get; set; }
	}
}
