using System;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace LearningStarter
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // -----------------------------
            // 1. CORS FIX FOR RENDER + VERCEL
            // -----------------------------
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", builder =>
                {
                    builder
                        .WithOrigins(
                            "https://blood-bridge-frontend.vercel.app", // Your Vercel domain
                            "http://localhost:3000",
                            "http://localhost:3001"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // Needed for Identity cookies
                });
            });

            services.AddControllers();

            services.AddHsts(options =>
            {
                options.MaxAge = TimeSpan.MaxValue;
                options.Preload = true;
                options.IncludeSubDomains = true;
            });

            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            // -----------------------------
            // 2. IDENTITY SETUP
            // -----------------------------
            services.AddIdentity<User, Role>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;
                options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
            })
            .AddEntityFrameworkStores<DataContext>();

            services.AddMvc();

            // -----------------------------
            // 3. FIX FOR CROSS-SITE COOKIES (VERCEL → RENDER)
            // -----------------------------
            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

            services.AddAuthorization();

            // -----------------------------
            // 4. Swagger
            // -----------------------------
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "BloodBridge Backend",
                    Version = "v1",
                });

                c.MapType(typeof(IFormFile), () => new OpenApiSchema
                {
                    Type = "file",
                    Format = "binary"
                });
            });

            services.AddHttpContextAccessor();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
        {
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            // -----------------------------
            // 5. CORS MUST BE HERE
            // -----------------------------
            app.UseCors("AllowFrontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger(options => { options.SerializeAsV2 = true; });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "BloodBridge API V1");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // -----------------------------
            // 6. Seeding
            // -----------------------------
            using var scope = app.ApplicationServices.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

            SeedRoles(dataContext, roleManager).Wait();
            SeedUsers(dataContext, userManager).Wait();
            SeedHospitals(dataContext);
            SeedBloodTypes(dataContext);
            SeedBloodInventory(dataContext);
        }

        // -------------------- Seeding --------------------

        private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
        {
            if (dataContext.Users.Any()) return;

            var seededUser = new User
            {
                FirstName = "Seeded",
                LastName = "User",
                UserName = "Admin",
                Email = "seededuser@gmail.com",
                PhoneNumber = "+11234567890",
                Address = "1204 Hooks Dr, Hammond, LA, 70401",
                DateOfBirth = "2004/06/14",
                Gender = "Male",
                UserType = "Admin",
                BloodType = "A+",
            };

            await userManager.CreateAsync(seededUser, "Password");
            await userManager.AddToRoleAsync(seededUser, "Admin");
            await dataContext.SaveChangesAsync();
        }

        private static async Task SeedRoles(DataContext dataContext, RoleManager<Role> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new Role { Name = "Admin" });
            }

            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new Role { Name = "User" });
            }

            await dataContext.SaveChangesAsync();
        }

        private static void SeedHospitals(DataContext dataContext)
        {
            if (dataContext.Hospitals.Any()) return;

            var hospitals = new[]
            {
                new Hospital { Name="North Oaks Hospital", Email="northoaks@gmail.com", Phone="985-345-2700", Address="15837 Paul Vega MD Drive, Hammond, LA, 70403" },
                new Hospital { Name="Lake View Hospital", Email="lakeviewhospital@gmail.com", Phone="985-867-3800", Address="95 Judge Tanner BLVD, Covington, LA, 70433" },
                new Hospital { Name="LSU Lallie Kemp Medical Center", Email="lsulallie@gmail.com", Phone="985-878-9421", Address="52579 US 51, Independence, LA, 70440" },
                new Hospital { Name="PAM Health Speciality Hospital of Hammond", Email="pamhealth@gmail.com", Phone="985-902-8148", Address="42074 Veterans Avenue, Hammond, LA, 70403" },
            };

            dataContext.Hospitals.AddRange(hospitals);
            dataContext.SaveChanges();
        }

        private static void SeedBloodTypes(DataContext dataContext)
        {
            if (dataContext.BloodTypes.Any()) return;

            string[] types = { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" };
            foreach (var type in types)
            {
                dataContext.BloodTypes.Add(new BloodType { BloodTypeName = type });
            }
            dataContext.SaveChanges();
        }

        private static void SeedBloodInventory(DataContext dataContext)
        {
            if (dataContext.BloodInventories.Any()) return;

            var random = new Random();
            var hospitals = dataContext.Hospitals.ToList();
            var bloodTypes = dataContext.BloodTypes.ToList();

            foreach (var hospital in hospitals)
            {
                foreach (var bloodType in bloodTypes)
                {
                    dataContext.BloodInventories.Add(new BloodInventory
                    {
                        HospitalId = hospital.Id,
                        BloodTypeId = bloodType.Id,
                        AvailableUnits = random.Next(5, 25)
                    });
                }
            }

            dataContext.SaveChanges();
        }
    }
}
