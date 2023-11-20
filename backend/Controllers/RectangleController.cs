using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Resizable_rectangle_be_INTUS.Interfaces;
using Resizable_rectangle_be_INTUS.Models;
using System.Text.Json;

namespace Resizable_rectangle_be_INTUS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RectangleController : Controller
    {
        private readonly IRectangleRepository _rectangleRepository;

        public RectangleController(IRectangleRepository rectangleRepository)
        {
            this._rectangleRepository = rectangleRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(RectangleCoordinates))]
        [ProducesResponseType(400)]
        public IActionResult GetRectangleCoordinates()
        {
            var rectangleCoordinates = _rectangleRepository.GetRectangleCoordinates();

            return Ok(rectangleCoordinates);
        }

        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult UpdateRectangleCoordinates([FromBody] RectangleCoordinates rectangleCoordinates)
        {
            _rectangleRepository.UpdateRectangleCoordinates(rectangleCoordinates);

            return NoContent();
        }
    }
}
