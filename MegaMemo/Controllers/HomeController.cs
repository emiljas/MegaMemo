using DotNetOpenAuth.AspNet;
using MegaMemo.Models;
using MegaMemo.Models.Context;
using MegaMemo.Utils.Cache;
using Microsoft.Web.WebPages.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;

namespace MegaMemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ClearCache()
        {
            CacheWrapper.Instance.ClearAllCache();
            return RedirectToAction("Index");
        }
    }
}
