namespace MegaMemo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _2014 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cards",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ClientId = c.Int(nullable: false),
                        DeckId = c.Int(nullable: false),
                        Front = c.String(),
                        Back = c.String(),
                        RepetitionCount = c.Int(nullable: false),
                        EasinessFactor = c.Double(nullable: false),
                        NextRepetitionDate = c.Long(nullable: false),
                        DaysToNextRepetition = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Decks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ClientId = c.Int(nullable: false),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Decks");
            DropTable("dbo.Cards");
        }
    }
}
