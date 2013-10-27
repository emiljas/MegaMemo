using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Utils.Cache
{
    public interface ICacheWrapper
    {
        object Get(string key);
        void Insert(string key, object value);
    }
}