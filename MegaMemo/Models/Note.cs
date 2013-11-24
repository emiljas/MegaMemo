using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}