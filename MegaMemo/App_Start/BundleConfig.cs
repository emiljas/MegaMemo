using System;
using System.Web;
using System.Web.Optimization;

namespace MegaMemo
{
    public static class BundleConfig
    {
        private static BundleCollection _bundles;

        public static void RegisterBundles(BundleCollection bundles)
        {
            _bundles = bundles;

            RegisterExternalJs();
            RegisterCustomJs();
            RegisterExternalCss();
            RegisterCustomCss();

#if RELEASE
            BundleTable.EnableOptimizations = true;
#endif
        }

        private static void RegisterExternalJs()
        {
            _bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/External/jquery/jquery-{version}.js",
                        "~/Scripts/External/jqueryValidate/jquery.validate.js"
                        ));
        }

        private static void RegisterCustomJs()
        {
            _bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/Custom/app.js"
                    ));
        }
        
        private static void RegisterExternalCss()
        {
        }

        private static void RegisterCustomCss()
        {
        }
    }
}