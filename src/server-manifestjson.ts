import * as crypto from "crypto";
import * as path from "path";
import * as util from "util";

import * as express from "express";
import { JSON } from "ta-json";

import { EpubParser } from "./parser/epub";
import { sortObject } from "./utils";
import { encodeURIComponent_RFC3986 } from "./utils";

export function serverManifestJson(routerPathBase64: express.Router) {

    const routerManifestJson = express.Router({ strict: false });
    // routerManifestJson.use(morgan("combined"));

    routerManifestJson.get(["/", "/show/:jsonPath?"],
        (req: express.Request, res: express.Response) => {

            if (!req.params.pathBase64) {
                req.params.pathBase64 = (req as any).pathBase64;
            }

            const isSecureHttp = req.secure ||
                req.protocol === "https" ||
                req.get("X-Forwarded-Protocol") === "https" ||
                true; // FIXME: forcing to secure http because forward proxy to HTTP localhost

            const pathBase64Str = new Buffer(req.params.pathBase64, "base64").toString("utf8");

            EpubParser.load(pathBase64Str)
                .then((publication) => {
                    console.log("== EpubParser: resolve");
                    // dumpPublication(publication);

                    // console.log(req.url); // path local to this router
                    // console.log(req.baseUrl); // path local to above this router
                    // console.log(req.originalUrl); // full path (req.baseUrl + req.url)
                    // url.parse(req.originalUrl, false).host
                    // req.headers.host has port, not req.hostname

                    const rootUrl = (isSecureHttp ? "https://" : "http://")
                        + req.headers.host + "/pub/"
                        + encodeURIComponent_RFC3986(req.params.pathBase64);
                    const manifestURL = rootUrl + "/manifest.json";
                    publication.AddLink("application/webpub+json", ["self"], manifestURL, false);

                    let hasMO = false;
                    if (publication.Spine) {
                        const link = publication.Spine.find((l) => {
                            if (l.Properties && l.Properties.MediaOverlay) {
                                return true;
                            }
                            return false;
                        });
                        if (link) {
                            hasMO = true;
                        }
                    }
                    if (hasMO) {
                        const moURL = rootUrl + "/" + EpubParser.mediaOverlayURLPath +
                            "?" + EpubParser.mediaOverlayURLParam + "={path}";
                        publication.AddLink("application/vnd.readium.mo+json", ["media-overlay"], moURL, true);
                    }
                    if (req.url.indexOf("/show") >= 0) {
                        let objToSerialize: any = null;

                        if (req.params.jsonPath) {
                            switch (req.params.jsonPath) {

                                case "all": {
                                    objToSerialize = publication;
                                    break;
                                }
                                case "cover": {
                                    objToSerialize = publication.GetCover();
                                    break;
                                }
                                case "mediaoverlays": {
                                    objToSerialize = publication.FindAllMediaOverlay();
                                    break;
                                }
                                case "spine": {
                                    objToSerialize = publication.Spine;
                                    break;
                                }
                                case "pagelist": {
                                    objToSerialize = publication.PageList;
                                    break;
                                }
                                case "landmarks": {
                                    objToSerialize = publication.Landmarks;
                                    break;
                                }
                                case "links": {
                                    objToSerialize = publication.Links;
                                    break;
                                }
                                case "resources": {
                                    objToSerialize = publication.Resources;
                                    break;
                                }
                                case "toc": {
                                    objToSerialize = publication.TOC;
                                    break;
                                }
                                case "metadata": {
                                    objToSerialize = publication.Metadata;
                                    break;
                                }
                                default: {
                                    objToSerialize = null;
                                }
                            }
                        } else {
                            objToSerialize = publication;
                        }

                        if (!objToSerialize) {
                            objToSerialize = {};
                        }

                        const jsonObj = JSON.serialize(objToSerialize);
                        const jsonStr = global.JSON.stringify(jsonObj, null, "    ");

                        // breakLength: 100  maxArrayLength: undefined
                        const dumpStr = util.inspect(objToSerialize,
                            { showHidden: false, depth: 1000, colors: false, customInspect: true });

                        res.status(200).send("<html><body>" +
                            "<h1>" + path.basename(pathBase64Str) + "</h1>" +
                            "<p><pre>" + jsonStr + "</pre></p>" +
                            "<p><pre>" + dumpStr + "</pre></p>" +
                            "</body></html>");
                    } else {
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.set("Content-Type", "application/webpub+json; charset=utf-8");

                        const publicationJsonObj = JSON.serialize(publication);
                        const publicationJsonStr = global.JSON.stringify(sortObject(publicationJsonObj), null, "");

                        const checkSum = crypto.createHash("sha256");
                        checkSum.update(publicationJsonStr);
                        const hash = checkSum.digest("hex");

                        const match = req.header("If-None-Match");
                        if (match === hash) {
                            res.status(304); // StatusNotModified
                            return;
                        }

                        res.setHeader("ETag", hash);

                        const links = publication.GetPreFetchResources();
                        if (links && links.length) {
                            let prefetch = "";
                            links.forEach((l) => {
                                prefetch += "<" + l.Href + ">;" + "rel=prefetch,";
                            });

                            res.setHeader("Link", prefetch);
                        }

                        // res.setHeader("Cache-Control", "public,max-age=86400");

                        res.status(200).send(publicationJsonStr);
                    }
                }).catch((err) => {
                    console.log("== EpubParser: reject");
                    console.log(err);
                    res.status(500).send("<html><body><p>Internal Server Error</p><p>" + err + "</p></body></html>");
                });
        });

    routerPathBase64.use("/:pathBase64/manifest.json", routerManifestJson);
}
