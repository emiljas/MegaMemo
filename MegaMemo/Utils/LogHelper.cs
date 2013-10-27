using log4net;
using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace MegaMemo.Utils
{
    public class LogHelper
    {
        static LogHelper()
        {
            var config = WebConfigurationManager.AppSettings.Get("log4net.config");
            var file = new FileInfo(config);
            XmlConfigurator.Configure(file);
        }

        public static ILog GetLog()
        {
            return LogManager.GetLogger("MegaMemoLog");
        }
    }
}