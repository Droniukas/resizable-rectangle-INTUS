using Resizable_rectangle_be_INTUS.Models;

namespace Resizable_rectangle_be_INTUS.Interfaces
{
    public interface IRectangleRepository
    {
        RectangleCoordinates GetRectangleCoordinates();
        void UpdateRectangleCoordinates(RectangleCoordinates rectangleCoordinates);
    }
}
