﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Models
{
    public class Deck
    {
        [JsonIgnore]
        public int UserId { get; set; }

        [JsonProperty("id")]
        public int ClientId { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }
    }
}