using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Caching;
using MegaMemo.Utils;
using Xunit;
using Moq;
using System.Web;
using MegaMemo.Utils.Cache;
using System.Threading;
using MegaMemo;
using Microsoft.QualityTools.Testing.Fakes;

namespace MegaMemoTests
{
    public class CacheExtensionsTests
    {
        private class MockedCacheWrapper : ICacheWrapper
        {
            private int _insertCallCount = 0;
            private object _value;

            public int InsertCallCount { get { return _insertCallCount; } } 

            public object Get(string key)
            {
                return _value;
            }

            public void Insert(string key, object value)
            {
                ++_insertCallCount;
                _value = value;
            }
        }


        [Fact()]
        public void ManyCacheRequest_OneRequestToDb()
        {
            //Arrange
            const int expectedInsertCallCount = 1;
            var cache = new MockedCacheWrapper();
            const int times = 5;

            var threads = new Thread[times];

            string result1, result2, result3, result4, result5;

            result1 = result2 = result3 = result4 = result5 = null;

            var key = "key_" + Guid.NewGuid().ToString();

            //Act
            for (int i = 0; i < times; ++i)
            {
                Func<string> generate = () => Guid.NewGuid().ToString();

                switch (i)
                {
                    case 0:
                        (threads[0] = new Thread(() => result1 = cache.GetOrStore(key, generate))).Start();
                        break;
                    case 1:
                        (threads[1] = new Thread(() => result2 = cache.GetOrStore(key, generate))).Start();
                        break;
                    case 2:
                        (threads[2] = new Thread(() => result3 = cache.GetOrStore(key, generate))).Start();
                        break;
                    case 3:
                        (threads[3] = new Thread(() => result4 = cache.GetOrStore(key, generate))).Start();
                        break;
                    case 4:
                        (threads[4] = new Thread(() => result5 = cache.GetOrStore(key, generate))).Start();
                        break;
                    default:
                        break;
                }
            }

            foreach (var thread in threads)
            {
                thread.Join();
            }

            //Assert
            Assert.True((result1 == result2) && (result2 == result3) && (result4 == result5) && (result1 == result5));
            Assert.Equal(expectedInsertCallCount, cache.InsertCallCount);
        }
    }
}
