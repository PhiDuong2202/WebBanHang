using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using System.Security.Cryptography;
using backend.Data;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT Support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BanHang API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure DbContext with MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30))));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite React client
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "super_secret_key_that_is_long_enough_to_be_secure_123456";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "banhang_backend",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "banhang_frontend",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database initialization and Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        
        // Apply migrations automatically
        context.Database.Migrate();

        // Seed Users
        if (!context.Users.Any())
        {
            // Seed Admin User (username: admin, password: admin123)
            context.Users.Add(new User
            {
                Username = "admin",
                PasswordHash = HashPassword("admin123"),
                FullName = "Hệ thống Admin",
                Email = "admin@banhang.com",
                Role = "Admin"
            });

            // Seed Test Customer User (username: customer, password: customer123)
            context.Users.Add(new User
            {
                Username = "customer",
                PasswordHash = HashPassword("customer123"),
                FullName = "Nguyễn Văn Khách",
                Email = "customer@gmail.com",
                Role = "Customer"
            });

            context.SaveChanges();
        }

        // Seed Products
        if (!context.Products.Any())
        {
            context.Products.AddRange(
                new Product
                {
                    Name = "iPhone 15 Pro Max 256GB",
                    Description = "Điện thoại Apple iPhone 15 Pro Max chính hãng phiên bản 256GB với chip A17 Pro mạnh mẽ và khung titan siêu bền bỉ.",
                    Price = 29990000,
                    ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=60",
                    Category = "Điện thoại",
                    Stock = 50
                },
                new Product
                {
                    Name = "MacBook Pro M3 14 inch",
                    Description = "Laptop Apple MacBook Pro 14 inch trang bị chip Apple M3, 8GB RAM, 512GB SSD. Thiết kế sang trọng, thời lượng pin ấn tượng.",
                    Price = 39990000,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
                    Category = "Laptop",
                    Stock = 20
                },
                new Product
                {
                    Name = "Tai nghe Sony WH-1000XM5",
                    Description = "Tai nghe chụp tai chống ồn chủ động Sony WH-1000XM5 với âm thanh đỉnh cao, thời lượng pin lên đến 30 tiếng liên tục.",
                    Price = 7490000,
                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
                    Category = "Phụ kiện",
                    Stock = 30
                },
                new Product
                {
                    Name = "Apple Watch Ultra 2 GPS + Cellular",
                    Description = "Đồng hồ thông minh thể thao chuyên nghiệp với khung vỏ Titanium siêu cứng, màn hình siêu sáng 3000 nits.",
                    Price = 21490000,
                    ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=60",
                    Category = "Đồng hồ",
                    Stock = 15
                },
                new Product
                {
                    Name = "iPad Pro 11 inch M2 Wi-Fi",
                    Description = "Máy tính bảng iPad Pro 11 inch thế hệ mới trang bị chip M2, màn hình Liquid Retina cực sắc nét, tương thích Apple Pencil 2.",
                    Price = 20990000,
                    ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60",
                    Category = "Máy tính bảng",
                    Stock = 25
                }
            );

            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration or seeding.");
    }
}

app.Run();

// Helper password hashing method
string HashPassword(string password)
{
    using (var sha256 = SHA256.Create())
    {
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}
