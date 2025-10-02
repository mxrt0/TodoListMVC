namespace TodoListAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(setup =>
            {
                setup.AddPolicy("AllowSPA", policy =>
                {
                    policy.WithOrigins("https://localhost:7077")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });


            var app = builder.Build();

            app.UseCors("AllowSPA");

            app.UseHttpsRedirection();

            // Endpoints

            app.Run();
        }
    }
}
