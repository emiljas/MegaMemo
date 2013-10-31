using MegaMemo.Models.Context;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebMatrix.WebData;

namespace MegaMemo.Models
{
    public class DataInitializer : DropCreateDatabaseAlways<MegaMemoDbContext>
    {
        private MegaMemoDbContext _context;

        protected override void Seed(MegaMemoDbContext context)
        {
            _context = context;

            InitializeSimpleMembership();
        }

        private void InitializeSimpleMembership()
        {
            try
            {
#if DEBUG
                WebSecurity.InitializeDatabaseConnection("DefaultConnectionLocal",
                    "UserProfile", "UserId", "UserName", autoCreateTables: true);
#else
                WebSecurity.InitializeDatabaseConnection("DefaultConnection",
                    "UserProfile", "UserId", "UserName", autoCreateTables: true);
#endif
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(@"The ASP.NET Simple Membership database could not be initialized. 
                                                    For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
            }
        }
    }
}