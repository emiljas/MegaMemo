using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace MegaMemo.Utils.Cache
{
    public static class CacheWrapperExtensions
    {
        private static object sync = new object();

        public static T GetOrStore<T>(this ICacheWrapper cache, string key, Func<T> generate)
        {
            var result = cache.Get(key);
            if (result == null)
            {
                lock (sync)
                {
                    result = cache.Get(key);
                    if (result == null)
                    {
                        result = generate();
                        cache.Insert(key, result);
                    }
                }
            }
            return (T)result;
        }
    }
}