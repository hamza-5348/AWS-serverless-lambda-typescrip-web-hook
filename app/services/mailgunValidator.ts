import crypto from 'crypto';
import { MailgunSignatureDTO } from "../model/dto/mailgunSignatureDTO";
import AWSHelper from '../utils/awsHelper';
import { IRequestValidator } from "./interfaces/IRequestValidator";

/**
 * Mailgun signature verification adapter
 */
export default class MailgunValidator implements IRequestValidator {


    private async getMailgunSigningKey(ssmPath: string): Promise<string> {
        const mailgunSigningKey = await AWSHelper.getSsmParameterValue(ssmPath);
        if (mailgunSigningKey === 'Enter your signing key') {
            throw new Error(`${mailgunSigningKey} at ssm parameter store path:${process.env.MAILGUN_SIGNING_PARAMETER_PATH}`);
        }
        return mailgunSigningKey;
    }

    async validateRequest(signatureObject: MailgunSignatureDTO): Promise<Boolean> {

        try {
            const ssmPathSigningKey: string = process.env.MAILGUN_SIGNING_PARAMETER_PATH;
            const signingKey = await this.getMailgunSigningKey(ssmPathSigningKey);
            const encodedToken = crypto
                .createHmac('sha256', signingKey)
                .update((signatureObject?.timestamp).toString().concat(signatureObject?.token))
                .digest('hex');

            return encodedToken === signatureObject?.signature;
        } catch (error) {
            const message = `Error in validating Mailgun Signature, Error: ${error.message}`;
            console.log(message);
            throw (new Error(message));
        }

    }

}