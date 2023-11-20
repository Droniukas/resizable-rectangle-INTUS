using Resizable_rectangle_be_INTUS.Interfaces;
using Resizable_rectangle_be_INTUS.Repository;

namespace Resizable_rectangle_be_INTUS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                    policy =>
                                    {
                                        policy.AllowAnyOrigin()
                                   .AllowAnyMethod()
                                   .AllowAnyHeader();
                                    });
            });

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddScoped<IRectangleRepository, RectangleRepository>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseCors(MyAllowSpecificOrigins);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}