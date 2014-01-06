using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMemo.Models
{
    public class Card
    {
        [JsonIgnore]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [JsonIgnore]
        public int UserId { get; set; }

        [JsonProperty("id")]
        public int ClientId { get; set; }

        [JsonProperty("lastUpdateDate")]
        public long LastUpdateDate { get; set; }

        [JsonProperty("deckId")]
        public int DeckId { get; set; }

        [JsonProperty("front")]
        public string Front { get; set; }

        [JsonProperty("back")]
        public string Back { get; set; }

        [JsonProperty("repetitionCount")]
        public int RepetitionCount { get; set; }

        [JsonProperty("easinessFactor")]
        public double EasinessFactor { get; set; }

        [JsonProperty("nextRepetitionDate")]
        public long NextRepetitionDate { get; set; }

        [JsonProperty("daysToNextRepetition")]
        public int DaysToNextRepetition { get; set; }
    }
}