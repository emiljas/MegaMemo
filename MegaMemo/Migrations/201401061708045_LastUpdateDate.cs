namespace MegaMemo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LastUpdateDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cards", "LastUpdateDate", c => c.Long(nullable: false));
            AddColumn("dbo.Decks", "LastUpdateDate", c => c.Long(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Decks", "LastUpdateDate");
            DropColumn("dbo.Cards", "LastUpdateDate");
        }
    }
}
