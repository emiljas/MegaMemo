using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using WebMatrix.WebData;

namespace MegaMemo.Models.Context
{
    public class SimpleMembershipInitializer
    {
        public SimpleMembershipInitializer()
        {
            Database.SetInitializer<MegaMemoDbContext>(null);

            try
            {
                using (var context = new MegaMemoDbContext())
                {
                    if (!context.Database.Exists())
                    {
                        // Create the SimpleMembership database without Entity Framework migration schema
                        ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
                    }
                }

                WebSecurity.InitializeDatabaseConnection(MegaMemoDbContext.ConnectionStringName,
                    "UserProfile", "UserId", "UserName", autoCreateTables: true);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("The ASP.NET Simple Membership database could not be initialized. For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
            }
        }
    }
}