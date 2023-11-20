using Resizable_rectangle_be_INTUS.Interfaces;
using Resizable_rectangle_be_INTUS.Models;
using System.Text.Json;

namespace Resizable_rectangle_be_INTUS.Repository
{
    public class RectangleRepository : IRectangleRepository
    {
        public RectangleCoordinates GetRectangleCoordinates()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            string filePath = "./Resources/RectangleCoordinatesData.json";
            string jsonString = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<RectangleCoordinates>(jsonString, options)!;
        }

        public void UpdateRectangleCoordinates(RectangleCoordinates rectangleCoordinates)
        {
            string filePath = "./Resources/RectangleCoordinatesData.json";
            string jsonString = JsonSerializer.Serialize(rectangleCoordinates);
            File.WriteAllText(filePath, jsonString);
        }
    }
}
