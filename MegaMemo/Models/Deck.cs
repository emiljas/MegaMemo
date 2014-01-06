using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMemo.Models
{
    public class Deck
    {
        [JsonIgnore]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [JsonIgnore]
        public int UserId { get; set; }

        [JsonProperty("lastUpdateDate")]
        public long LastUpdateDate { get; set; }

        [JsonProperty("id")]
        public int ClientId { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }
    }
}