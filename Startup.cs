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
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
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

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();



        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = "file", Format = "binary" });
        });

        services.AddSpaStaticFiles(config => { config.RootPath = "learning-starter-web/build"; });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();

        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger(options => { options.SerializeAsV2 = true; });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1"); });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });

        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetService<RoleManager<Role>>();

        SeedRoles(dataContext, roleManager).Wait();
        SeedUsers(dataContext, userManager).Wait();
        SeedHospitals(dataContext);
        SeedBloodTypes(dataContext);
        SeedBloodInventory(dataContext);

    }

    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
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
    }

    private static void SeedHospitals(DataContext dataContext)
    {
        if (dataContext.Set<Hospital>().Any())
        {
            return;
        }

        var seededHospital1 = new Hospital()
        {
            Name = "North Oaks Hospital",
            Email = "northoaks@gmail.com",
            Phone = "985-345-2700",
            Address = "15837 Paul Vega MD Drive, Hammond, LA, 70403",
        };
        var seededHospital2 = new Hospital()
        {
            Name = "Lake View Hospital",
            Email = "lakeviewhospital@gmail.com",
            Phone = "985-867-3800",
            Address = "95 Judge Tanner BLVD, Covington, LA, 70433",
        };
        var seededHospital3 = new Hospital()
        {
            Name = "LSU Lallie Kemp Medical Center",
            Email = "lsulallie@gmail.com",
            Phone = "985-878-9421",
            Address = "52579 US 51, Independence, LA, 70440",
        };
        var seededHospital4 = new Hospital()
        {
            Name = "PAM Health Speciality Hospital of Hammond",
            Email = "pamhealth@gmail.com",
            Phone = "985-902-8148",
            Address = "42074 Veterans Avenue, Hammond, LA, 70403",
        };

        dataContext.Set<Hospital>().Add(seededHospital1);
        dataContext.Set<Hospital>().Add(seededHospital2);
        dataContext.Set<Hospital>().Add(seededHospital3);
        dataContext.Set<Hospital>().Add(seededHospital4);

        dataContext.SaveChanges();
    }

    private static void SeedBloodTypes(DataContext dataContext)
    {
        if (dataContext.Set<BloodType>().Any())
        {
            return;
        }

        var seededBloodType1 = new BloodType()
        {
            BloodTypeName = "A+",
        };
        var seededBloodType2 = new BloodType()
        {
            BloodTypeName = "A-",
        };
        var seededBloodType3 = new BloodType()
        {
            BloodTypeName = "B+",
        };
        var seededBloodType4 = new BloodType()
        {
            BloodTypeName = "B-",
        };
        var seededBloodType5 = new BloodType()
        {
            BloodTypeName = "AB+",
        };
        var seededBloodType6 = new BloodType()
        {
            BloodTypeName = "AB-",
        };
        var seededBloodType7 = new BloodType()
        {
            BloodTypeName = "O+",
        };
        var seededBloodType8 = new BloodType()
        {
            BloodTypeName = "O-",
        };

        dataContext.Set<BloodType>().Add(seededBloodType1);
        dataContext.Set<BloodType>().Add(seededBloodType2);
        dataContext.Set<BloodType>().Add(seededBloodType3);
        dataContext.Set<BloodType>().Add(seededBloodType4);
        dataContext.Set<BloodType>().Add(seededBloodType5);
        dataContext.Set<BloodType>().Add(seededBloodType6);
        dataContext.Set<BloodType>().Add(seededBloodType7);
        dataContext.Set<BloodType>().Add(seededBloodType8);

        dataContext.SaveChanges();
    }

    private static void SeedBloodInventory(DataContext dataContext)
    {
        if (dataContext.BloodInventories.Any())
        {
            return; // Already seeded
        }

        var random = new Random();
        var hospitals = dataContext.Hospitals.ToList();
        var bloodTypes = dataContext.BloodTypes.ToList();

        foreach (var hospital in hospitals)
        {
            foreach (var bloodType in bloodTypes)
            {
                var inventory = new BloodInventory
                {
                    BloodTypeId = bloodType.Id,
                    HospitalId = hospital.Id,
                    AvailableUnits = random.Next(5, 25)
                };

                dataContext.BloodInventories.Add(inventory);
            }
        }

        dataContext.SaveChanges();
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
}