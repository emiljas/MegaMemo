using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Utils.Cache
{
    public sealed class CacheWrapper : ICacheWrapper
    {
        private static readonly CacheWrapper _instance = new CacheWrapper();

        public static CacheWrapper Instance
        {
            get { return _instance; }
        }

        public object Get(string key)
        {
            return HttpContext.Current.Cache.Get(key);
        }

        public void Insert(string key, object value)
        {
            HttpContext.Current.Cache.Insert(key, value, null, DateTime.Now.AddMinutes(20)
                , System.Web.Caching.Cache.NoSlidingExpiration);
        }

        public void ClearAllCache()
        {
            var cache = HttpContext.Current.Cache;
            IDictionaryEnumerator enumerator = cache.GetEnumerator();

            while (enumerator.MoveNext())
            {
                cache.Remove(enumerator.Key.ToString());
            }
        }
    }
}