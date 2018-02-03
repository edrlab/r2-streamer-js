import * as crypto from "crypto";
import * as selfsigned from "selfsigned";
import * as uuid from "uuid";

export interface CertificateData {
    trustKey: string;
    trustCheck: string;

    // clientprivate?: string;
    // clientpublic?: string;
    // clientcert?: string;

    private?: string; // https.ServerOptions.key
    public?: string;
    cert?: string; // https.ServerOptions.cert
}

export async function generateSelfSignedData(): Promise<CertificateData> {
    return new Promise<CertificateData>((resolve, reject) => {
        const opts = {
            algorithm: "sha256",
            // clientCertificate: true,
            // clientCertificateCN: "R2 insecure client",
            days: 30,
            extensions: [{
                altNames: [{
                    type: 2, // DNSName
                    value: "localhost",
                }],
                name: "subjectAltName",
            }],
        };
        const rand = uuid.v4();
        const attributes = [{ name: "commonName", value: "R2 insecure server " + rand }];

        selfsigned.generate(attributes, opts, (err: any, keys: any) => {
            if (err) {
                reject(err);
                return;
            }

            const checkSum = crypto.createHash("sha256");
            checkSum.update(uuid.v4());
            const key = checkSum.digest("hex").toUpperCase();
            (keys as CertificateData).trustKey = key;

            (keys as CertificateData).trustCheck = uuid.v4();

            resolve(keys as CertificateData);
        });
    });
}
