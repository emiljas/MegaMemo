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

#if DEBUG
            BundleTable.EnableOptimizations = true;
#else
            BundleTable.EnableOptimizations = true;
#endif
        }

        private static void RegisterExternalJs()
        {
            _bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/External/jquery/jquery-{version}.js",
                        "~/Scripts/External/jqueryValidate/jquery.validate.js"
            ));

            _bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/External/knockout/knockout-{version}.js"
            ));
        }

        private static void RegisterCustomJs()
        {
            _bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/Custom/login.js",
                        "~/Scripts/Custom/logo.js"
            ));
        }
        
        private static void RegisterExternalCss()
        {
        }

        private static void RegisterCustomCss()
        {
            _bundles.Add(new StyleBundle("~/bundles/style").Include(
                        "~/Content/style.css"
            ));
        }
    }
}