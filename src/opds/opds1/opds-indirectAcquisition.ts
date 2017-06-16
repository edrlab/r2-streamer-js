import {
    XmlObject,
    XmlXPathSelector,
} from "@utils/xml-js-mapper";

@XmlObject({
    app: "http://www.w3.org/2007/app",
    atom: "http://www.w3.org/2005/Atom",
    bibframe: "http://bibframe.org/vocab/",
    dcterms: "http://purl.org/dc/terms/",
    odl: "http://opds-spec.org/odl",
    opds: "http://opds-spec.org/2010/catalog",
    opensearch: "http://a9.com/-/spec/opensearch/1.1/",
    relevance: "http://a9.com/-/opensearch/extensions/relevance/1.0/",
    schema: "http://schema.org",
    thr: "http://purl.org/syndication/thread/1.0",
    xsi: "http://www.w3.org/2001/XMLSchema-instance",
})
export class IndirectAcquisition {

    // XPATH ROOT: /atom:feed/atom:link/opds:indirectAcquisition
    // XPATH ROOT: /atom:feed/atom:entry/atom:link/opds:indirectAcquisition

    // XPATH ROOT: /atom:feed/atom:entry/atom:link/opds:indirectAcquisition/opds:indirectAcquisition (recursive)

    @XmlXPathSelector("@type")
    public OpdsIndirectAcquisitionType: string;

    @XmlXPathSelector("opds:indirectAcquisition")
    public OpdsIndirectAcquisitions: IndirectAcquisition[];
}
