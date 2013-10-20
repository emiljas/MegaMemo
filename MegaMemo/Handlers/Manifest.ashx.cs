using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MegaMemo.Controllers
{
    public class Manifest : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/cache-manifest";
            context.Response.WriteFile(context.Server.MapPath("~/Content/Manifest.txt"));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}