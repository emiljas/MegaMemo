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
            _bundles.Add(new ScriptBundle("~/scriptBundles/jquery").Include(
                        "~/Scripts/External/jquery/jquery-{version}.js",
                        "~/Scripts/External/jqueryValidate/jquery.validate.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/knockout").Include(
                        "~/Scripts/External/knockout/knockout-{version}.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/bootstrap").Include(
                        "~/Scripts/External/bootstrap/bootstrap.js",
                        "~/Scripts/External/bootbox.js"
            ));
        }

        private static void RegisterCustomJs()
        {
            _bundles.Add(new ScriptBundle("~/scriptBundles/app").Include(
                        "~/Scripts/Custom/utils.js",
                        "~/Scripts/Custom/login.js",
                        "~/Scripts/Custom/logo.js",
                        "~/Scripts/Custom/registration.js"
            ));
        }
        
        private static void RegisterExternalCss()
        {
            _bundles.Add(new StyleBundle("~/styleBundles/bootstrap").Include(
                        "~/Content/External/bootstrap/bootstrap.css",
                        "~/Content/External/bootstrap/bootstrap-theme.css"
            ));
        }

        private static void RegisterCustomCss()
        {
            _bundles.Add(new StyleBundle("~/styleBundles/style").Include(
                        "~/Content/Custom/style.css"
            ));
        }
    }
}