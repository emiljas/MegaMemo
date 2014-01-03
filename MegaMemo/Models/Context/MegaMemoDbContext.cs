using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MegaMemo.Models.Context
{
    public class MegaMemoDbContext : DbContext
    { 
#if DEBUG
        public const string ConnectionStringName = "DefaultConnectionLocal";
#else
        public const string ConnectionStringName = "DefaultConnection";
#endif

        public MegaMemoDbContext()
            : base(ConnectionStringName)
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Deck> Decks { get; set; }
    }
}