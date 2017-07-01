import { Metadata } from "@models/metadata";
import { Contributor } from "@models/metadata-contributor";
import { Publication } from "@models/publication";
import { Link } from "@models/publication-link";
import { OPDSFeed } from "@opds/opds2/opds2";
import { OPDSLink } from "@opds/opds2/opds2-link";
import { test } from "ava";
import { JSON as TAJSON } from "ta-json";

import { initGlobals } from "../src/init-globals";
import {
    checkType,
    checkType_Array,
    checkType_Object,
    checkType_String,
    inspect,
    logJSON,
} from "./helpers";

initGlobals();

// ==========================

const contName1 = "theName1";
const contRole1 = "theRole1";
const cont1 = new Contributor();
cont1.Name = contName1;
cont1.Role = contRole1;
const contName2 = "theName2";
const contRole2 = "theRole2";
const cont2 = new Contributor();
cont2.Name = contName2;
cont2.Role = contRole2;

// ==========================

test("JSON SERIALIZE: Metadata.Imprint => Contributor[]", (t) => {

    const md = new Metadata();
    md.Imprint = [];
    md.Imprint.push(cont1);
    md.Imprint.push(cont2);
    inspect(md);

    const json = TAJSON.serialize(md);
    logJSON(json);

    checkType_Array(t, json.imprint);
    t.is(json.imprint.length, 2);

    checkType_Object(t, json.imprint[0]);

    checkType_String(t, json.imprint[0].name);
    t.is(json.imprint[0].name, contName1);

    checkType_String(t, json.imprint[0].role);
    t.is(json.imprint[0].role, contRole1);

    checkType_Object(t, json.imprint[1]);

    checkType_String(t, json.imprint[1].name);
    t.is(json.imprint[1].name, contName2);

    checkType_String(t, json.imprint[1].role);
    t.is(json.imprint[1].role, contRole2);
});

test("JSON SERIALIZE: Metadata.Imprint => Contributor[1] collapse-array", (t) => {

    const md = new Metadata();
    md.Imprint = [cont1];
    inspect(md);

    const json = TAJSON.serialize(md);
    // // (normalizes single-item array to the item value itself)
    // traverseJsonObjects(json,
    //     (obj, parent, keyInParent) => {
    //         if (parent && obj instanceof Array && obj.length === 1) {
    //             parent[keyInParent] = obj[0];
    //         }
    //     });
    logJSON(json);

    checkType_Object(t, json.imprint);

    checkType_String(t, json.imprint.name);
    t.is(json.imprint.name, contName1);

    checkType_String(t, json.imprint.role);
    t.is(json.imprint.role, contRole1);
});

// implemented, see IPropertyConverter.collapseArrayWithSingleItem()
// test("JSON SERIALIZE: Metadata.Imprint => Contributor[1] keep-array", (t) => {

//     const md = new Metadata();
//     md.Imprint = [cont1];
//     inspect(md);

//     const json = TAJSON.serialize(md);
//     logJSON(json);

//     checkType_Array(t, json.imprint);
//     t.is(json.imprint.length, 1);

//     checkType_Object(t, json.imprint[0]);

//     checkType_String(t, json.imprint[0].name);
//     t.is(json.imprint[0].name, contName1);

//     checkType_String(t, json.imprint[0].role);
//     t.is(json.imprint[0].role, contRole1);
// });

test("JSON DESERIALIZE: Metadata.Imprint => Contributor[]", (t) => {

    const json: any = {};
    json.imprint = [{ name: contName1, role: contRole1 }, { name: contName2, role: contRole2 }];
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 2);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName1);

    checkType_String(t, md.Imprint[0].Role);
    t.is(md.Imprint[0].Role, contRole1);

    checkType(t, md.Imprint[1], Contributor);

    checkType_String(t, md.Imprint[1].Name);
    t.is(md.Imprint[1].Name, contName2);

    checkType_String(t, md.Imprint[1].Role);
    t.is(md.Imprint[1].Role, contRole2);
});

test("JSON DESERIALIZE: Metadata.Imprint => Contributor[1]", (t) => {

    const json: any = {};
    json.imprint = [{ name: contName1, role: contRole1 }];
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 1);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName1);

    checkType_String(t, md.Imprint[0].Role);
    t.is(md.Imprint[0].Role, contRole1);
});

test("JSON DESERIALIZE: Metadata.Imprint => Contributor", (t) => {

    const json: any = {};
    json.imprint = { name: contName2, role: contRole2 };
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 1);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName2);

    checkType_String(t, md.Imprint[0].Role);
    t.is(md.Imprint[0].Role, contRole2);
});

test("JSON DESERIALIZE: Metadata.Imprint => ContributorSTR[]", (t) => {

    const json: any = {};
    json.imprint = [contName1, contName2];
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 2);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName1);

    checkType(t, md.Imprint[1], Contributor);

    checkType_String(t, md.Imprint[1].Name);
    t.is(md.Imprint[1].Name, contName2);
});

test("JSON DESERIALIZE: Metadata.Imprint => ContributorSTR[1]", (t) => {

    const json: any = {};
    json.imprint = [contName1];
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 1);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName1);
});

test("JSON DESERIALIZE: Metadata.Imprint => ContributorSTR", (t) => {

    const json: any = {};
    json.imprint = contName2;
    logJSON(json);

    const md: Metadata = TAJSON.deserialize<Metadata>(json, Metadata);
    inspect(md);

    checkType_Array(t, md.Imprint);
    t.is(md.Imprint.length, 1);

    checkType(t, md.Imprint[0], Contributor);

    checkType_String(t, md.Imprint[0].Name);
    t.is(md.Imprint[0].Name, contName2);
});

// ==========================

const contextStr1 = "http://context1";
const contextStr2 = "http://context2";

// ==========================

test("JSON SERIALIZE: Publication.Context => string[]", (t) => {

    const pub = new Publication();
    pub.Context = [];
    pub.Context.push(contextStr1);
    pub.Context.push(contextStr2);
    inspect(pub);

    const json = TAJSON.serialize(pub);
    logJSON(json);

    checkType_Array(t, json["@context"]);
    t.is(json["@context"].length, 2);

    checkType_String(t, json["@context"][0]);
    t.is(json["@context"][0], contextStr1);

    checkType_String(t, json["@context"][1]);
    t.is(json["@context"][1], contextStr2);
});

test("JSON SERIALIZE: Publication.Context => string[1] collapse-array", (t) => {

    const pub = new Publication();
    pub.Context = [contextStr1];
    inspect(pub);

    const json = TAJSON.serialize(pub);
    // // (normalizes single-item array to the item value itself)
    // traverseJsonObjects(json,
    //     (obj, parent, keyInParent) => {
    //         if (parent && obj instanceof Array && obj.length === 1) {
    //             parent[keyInParent] = obj[0];
    //         }
    //     });
    logJSON(json);

    checkType_String(t, json["@context"]);
    t.is(json["@context"], contextStr1);
});

// implemented, see IPropertyConverter.collapseArrayWithSingleItem()
// test("JSON SERIALIZE: Publication.Context => string[1] keep-array", (t) => {

//     const pub = new Publication();
//     pub.Context = [contextStr1];
//     inspect(pub);

//     const json = TAJSON.serialize(pub);
//     logJSON(json);

//     checkType_Array(t, json["@context"]);
//     t.is(json["@context"].length, 1);

//     checkType_String(t, json["@context"][0]);
//     t.is(json["@context"][0], contextStr1);
// });

test("JSON DESERIALIZE: Publication.Context => string[]", (t) => {

    const json: any = {};
    json["@context"] = [contextStr1, contextStr2];
    logJSON(json);

    const pub: Publication = TAJSON.deserialize<Publication>(json, Publication);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 2);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);

    checkType_String(t, pub.Context[1]);
    t.is(pub.Context[1], contextStr2);
});

test("JSON DESERIALIZE: Publication.Context => string[1]", (t) => {

    const json: any = {};
    json["@context"] = [contextStr1];
    logJSON(json);

    const pub: Publication = TAJSON.deserialize<Publication>(json, Publication);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 1);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);
});

test("JSON DESERIALIZE: Publication.Context => string", (t) => {

    const json: any = {};
    json["@context"] = contextStr1;
    logJSON(json);

    const pub: Publication = TAJSON.deserialize<Publication>(json, Publication);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 1);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);
});

// ==========================

test("JSON SERIALIZE: OPDSFeed.Context => string[]", (t) => {

    const pub = new OPDSFeed();
    pub.Context = [];
    pub.Context.push(contextStr1);
    pub.Context.push(contextStr2);
    inspect(pub);

    const json = TAJSON.serialize(pub);
    logJSON(json);

    checkType_Array(t, json["@context"]);
    t.is(json["@context"].length, 2);

    checkType_String(t, json["@context"][0]);
    t.is(json["@context"][0], contextStr1);

    checkType_String(t, json["@context"][1]);
    t.is(json["@context"][1], contextStr2);
});

test("JSON SERIALIZE: OPDSFeed.Context => string[1] collapse-array", (t) => {

    const pub = new OPDSFeed();
    pub.Context = [contextStr1];
    inspect(pub);

    const json = TAJSON.serialize(pub);
    // // (normalizes single-item array to the item value itself)
    // traverseJsonObjects(json,
    //     (obj, parent, keyInParent) => {
    //         if (parent && obj instanceof Array && obj.length === 1) {
    //             parent[keyInParent] = obj[0];
    //         }
    //     });
    logJSON(json);

    checkType_String(t, json["@context"]);
    t.is(json["@context"], contextStr1);
});

// implemented, see IPropertyConverter.collapseArrayWithSingleItem()
// test("JSON SERIALIZE: OPDSFeed.Context => string[1] keep-array", (t) => {

//     const pub = new OPDSFeed();
//     pub.Context = [contextStr1];
//     inspect(pub);

//     const json = TAJSON.serialize(pub);
//     logJSON(json);

//     checkType_Array(t, json["@context"]);
//     t.is(json["@context"].length, 1);

//     checkType_String(t, json["@context"][0]);
//     t.is(json["@context"][0], contextStr1);
// });

test("JSON DESERIALIZE: OPDSFeed.Context => string[]", (t) => {

    const json: any = {};
    json["@context"] = [contextStr1, contextStr2];
    logJSON(json);

    const pub: OPDSFeed = TAJSON.deserialize<OPDSFeed>(json, OPDSFeed);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 2);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);

    checkType_String(t, pub.Context[1]);
    t.is(pub.Context[1], contextStr2);
});

test("JSON DESERIALIZE: OPDSFeed.Context => string[1]", (t) => {

    const json: any = {};
    json["@context"] = [contextStr1];
    logJSON(json);

    const pub: OPDSFeed = TAJSON.deserialize<OPDSFeed>(json, OPDSFeed);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 1);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);
});

test("JSON DESERIALIZE: OPDSFeed.Context => string", (t) => {

    const json: any = {};
    json["@context"] = contextStr1;
    logJSON(json);

    const pub: OPDSFeed = TAJSON.deserialize<OPDSFeed>(json, OPDSFeed);
    inspect(pub);

    checkType_Array(t, pub.Context);
    t.is(pub.Context.length, 1);

    checkType_String(t, pub.Context[0]);
    t.is(pub.Context[0], contextStr1);
});

// ==========================

const relStr1 = "rel1";
const relStr2 = "rel2";

// ==========================

test("JSON SERIALIZE: OPDSLink.Rel => string[]", (t) => {

    const link = new OPDSLink();
    link.AddRel(relStr1);
    link.AddRel(relStr2);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_Array(t, json.rel);
    t.is(json.rel.length, 2);

    checkType_String(t, json.rel[0]);
    t.is(json.rel[0], relStr1);

    checkType_String(t, json.rel[1]);
    t.is(json.rel[1], relStr2);
});

test("JSON SERIALIZE: OPDSLink.Rel => string[] (recursive links)", (t) => {

    const link = new OPDSLink();
    link.AddRel(relStr1);
    link.AddRel(relStr2);
    const child = new OPDSLink();
    child.AddRel(relStr2);
    child.AddRel(relStr1);
    link.Children = [];
    link.Children.push(child);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_Array(t, json.rel);
    t.is(json.rel.length, 2);

    checkType_String(t, json.rel[0]);
    t.is(json.rel[0], relStr1);

    checkType_String(t, json.rel[1]);
    t.is(json.rel[1], relStr2);

    checkType_Array(t, json.children);
    t.is(json.children.length, 1);

    checkType_Array(t, json.children[0].rel);
    t.is(json.children[0].rel.length, 2);

    checkType_String(t, json.children[0].rel[0]);
    t.is(json.children[0].rel[0], relStr2);

    checkType_String(t, json.children[0].rel[1]);
    t.is(json.children[0].rel[1], relStr1);
});

test("JSON SERIALIZE: OPDSLink.Rel => string", (t) => {

    const link = new OPDSLink();
    link.AddRel(relStr1);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_String(t, json.rel);
    t.is(json.rel, relStr1);
});

test("JSON SERIALIZE: OPDSLink.Rel => string (recursive links)", (t) => {

    const link = new OPDSLink();
    link.AddRel(relStr1);
    const child = new OPDSLink();
    child.AddRel(relStr2);
    link.Children = [];
    link.Children.push(child);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_String(t, json.rel);
    t.is(json.rel, relStr1);

    checkType_Array(t, json.children);
    t.is(json.children.length, 1);

    checkType_String(t, json.children[0].rel);
    t.is(json.children[0].rel, relStr2);
});

test("JSON DESERIALIZE: OPDSLink.Rel => string[]", (t) => {

    const json: any = {};
    json.rel = [relStr1, relStr2];
    logJSON(json);

    const link: OPDSLink = TAJSON.deserialize<OPDSLink>(json, OPDSLink);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 2);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);

    checkType_String(t, link.Rel[1]);
    t.is(link.Rel[1], relStr2);
});

test("JSON DESERIALIZE: OPDSLink.Rel => string[] (recursive children)", (t) => {

    const json: any = {};
    json.rel = [relStr1, relStr2];
    json.children = [];
    json.children.push({ rel: [relStr2, relStr1] });
    logJSON(json);

    const link: OPDSLink = TAJSON.deserialize<OPDSLink>(json, OPDSLink);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 2);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);

    checkType_String(t, link.Rel[1]);
    t.is(link.Rel[1], relStr2);

    checkType_Array(t, link.Children);
    t.is(link.Children.length, 1);

    checkType_Array(t, link.Children[0].Rel);
    t.is(link.Children[0].Rel.length, 2);

    checkType_String(t, link.Children[0].Rel[0]);
    t.is(link.Children[0].Rel[0], relStr2);

    checkType_String(t, link.Children[0].Rel[1]);
    t.is(link.Children[0].Rel[1], relStr1);
});

test("JSON DESERIALIZE: OPDSLink.Rel => string[1]", (t) => {

    const json: any = {};
    json.rel = [relStr1];
    logJSON(json);

    const link: OPDSLink = TAJSON.deserialize<OPDSLink>(json, OPDSLink);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 1);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);
});

test("JSON DESERIALIZE: OPDSLink.Rel => string", (t) => {

    const json: any = {};
    json.rel = relStr1;
    logJSON(json);

    const link: OPDSLink = TAJSON.deserialize<OPDSLink>(json, OPDSLink);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 1);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);
});

test("JSON DESERIALIZE: OPDSLink.Rel => string (recursive children)", (t) => {

    const json: any = {};
    json.rel = relStr1;
    json.children = [];
    json.children.push({ rel: relStr2 });
    logJSON(json);

    const link: OPDSLink = TAJSON.deserialize<OPDSLink>(json, OPDSLink);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 1);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);

    checkType_Array(t, link.Children);
    t.is(link.Children.length, 1);

    checkType_Array(t, link.Children[0].Rel);
    t.is(link.Children[0].Rel.length, 1);

    checkType_String(t, link.Children[0].Rel[0]);
    t.is(link.Children[0].Rel[0], relStr2);
});

// ==========================

test("JSON SERIALIZE: Publication Link.Rel => string[]", (t) => {

    const link = new Link();
    link.AddRel(relStr1);
    link.AddRel(relStr2);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_Array(t, json.rel);
    t.is(json.rel.length, 2);

    checkType_String(t, json.rel[0]);
    t.is(json.rel[0], relStr1);

    checkType_String(t, json.rel[1]);
    t.is(json.rel[1], relStr2);
});

test("JSON SERIALIZE: Publication Link.Rel => string", (t) => {

    const link = new Link();
    link.AddRel(relStr1);
    inspect(link);

    const json = TAJSON.serialize(link);
    logJSON(json);

    checkType_String(t, json.rel);
    t.is(json.rel, relStr1);
});

test("JSON DESERIALIZE: Publication Link.Rel => string[]", (t) => {

    const json: any = {};
    json.rel = [relStr1, relStr2];
    logJSON(json);

    const link: Link = TAJSON.deserialize<Link>(json, Link);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 2);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);

    checkType_String(t, link.Rel[1]);
    t.is(link.Rel[1], relStr2);
});

test("JSON DESERIALIZE: Publication Link.Rel => string[1]", (t) => {

    const json: any = {};
    json.rel = [relStr1];
    logJSON(json);

    const link: Link = TAJSON.deserialize<Link>(json, Link);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 1);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);
});

test("JSON DESERIALIZE: Publication Link.Rel => string", (t) => {

    const json: any = {};
    json.rel = relStr1;
    logJSON(json);

    const link: Link = TAJSON.deserialize<Link>(json, Link);
    inspect(link);

    checkType_Array(t, link.Rel);
    t.is(link.Rel.length, 1);

    checkType_String(t, link.Rel[0]);
    t.is(link.Rel[0], relStr1);
});

// ==========================
