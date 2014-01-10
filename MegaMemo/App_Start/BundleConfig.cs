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
                        "~/Scripts/External/jquery/jquery.browser.js",
                        "~/Scripts/External/jqueryValidate/jquery.validate.js",
                        "~/Scripts/External/jHtmlArea/jHtmlArea-0.7.5.js",
                        "~/Scripts/External/jHtmlArea.ColorPickerMenu-0.7.0.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/knockout").Include(
                        "~/Scripts/External/knockout/knockout-{version}.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/bootstrap").Include(
                        "~/Scripts/External/bootstrap/bootstrap.js",
                        "~/Scripts/External/bootstrap/bootbox.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/moment").Include(
                        "~/Scripts/External/moment/moment.js"
            ));
        }

        private static void RegisterCustomJs()
        {
            _bundles.Add(new ScriptBundle("~/scriptBundles/app").Include(
                        "~/Scripts/Custom/utils.js",
                        "~/Scripts/Custom/logo.js",
                        "~/Scripts/Custom/login.js",
                        "~/Scripts/Custom/registration.js",
                        "~/Scripts/Custom/appguide.js",
                        "~/Scripts/Custom/synchronizer.js",
                        "~/Scripts/Custom/repository.js",
                        "~/Scripts/Custom/card.js"
            ));

            _bundles.Add(new ScriptBundle("~/scriptBundles/appSections").Include(
                        "~/Scripts/Custom/Sections/decksList.js",
                        "~/Scripts/Custom/Sections/editDeck.js",
                        "~/Scripts/Custom/Sections/studyList.js",
                        "~/Scripts/Custom/Sections/studyDeck.js"
            ));
        }
        
        private static void RegisterExternalCss()
        {
            _bundles.Add(new StyleBundle("~/styleBundles/jquery").Include(
                        "~/Content/External/jHtmlArea/jHtmlArea.css",
                        "~/Content/External/jHtmlArea/jHtmlArea.ColorPickerMenu.css"
                ));

            _bundles.Add(new StyleBundle("~/styleBundles/bootstrap").Include(
                        "~/Content/External/bootstrap/bootstrap.css",
                        "~/Content/External/bootstrap/bootstrap-theme.css",
                        "~/Content/External/cssTableGenerator/style.css"
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