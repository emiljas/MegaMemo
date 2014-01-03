using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Models
{
    public class Card
    {
        [JsonIgnore]
        public int UserId { get; set; }

        [JsonProperty("id")]
        public int ClientId { get; set; }

        [JsonProperty("deckId")]
        public int DeckId { get; set; }

        public string Front { get; set; }

        public string Back { get; set; }
    }
}