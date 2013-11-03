﻿using MegaMemo.Utils.Cache;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.SessionState;

namespace MegaMemo.Handlers
{
    /*
     * generate html5 cache manifest
     * add path to FoldersWithElementsToCache or to BundleConfig
     */
    public class Manifest : IHttpHandler, IRequiresSessionState
    {
        private HttpContext _context;
        private const double ManifestVersion = 1.0;

        private static readonly string[] FoldersWithElementsToCache = new[]
            {
                "/Images/",
                "/Content/"
            };

        public void ProcessRequest(HttpContext context)
        {
            _context = context;
            context.Response.ContentType = "text/cache-manifest";

            string html5CacheManifest = GetHtml5CacheManifest();
            context.Response.Write(html5CacheManifest);
        }

        private string GetHtml5CacheManifest()
        {
            return CacheWrapper.Instance.GetOrStore("MegaMemo.Handlers.Html5CacheManifest", GenerateHtml5CacheManifest);
        }

        private string GenerateHtml5CacheManifest()
        {
            var sb = new StringBuilder();

            sb.AppendLine("CACHE MANIFEST");
            sb.AppendFormat("# version {0}", ManifestVersion);
            sb.AppendLine();

            AppendFilesFromFolders(sb);
            AppendBundles(sb);

            return sb.ToString();
        }

        private void AppendFilesFromFolders(StringBuilder sb)
        {
            foreach (var folderPath in FoldersWithElementsToCache)
            {
                var paths = Directory.GetFiles(HttpContext.Current.Server.MapPath(folderPath));
                foreach (var path in paths)
                {
                    var fileName = Path.GetFileName(path);
                    if (!fileName.StartsWith("_"))
                        sb.AppendLine(folderPath + fileName);
                }
            }
        }

        private void AppendBundles(StringBuilder sb)
        {
            foreach (var bundle in BundleTable.Bundles)
            {
                var path = BundleTable.Bundles.ResolveBundleUrl(bundle.Path);
                sb.AppendLine(path);
            }
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