using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MegaMemo.Models.Context
{
    public class MegaMemoDbContext : DbContext
    {
        public MegaMemoDbContext()
#if DEBUG
            :base("DefaultConnectionLocal")
#else
            :base("DefaultConnection")
#endif
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}