import { MailgunSignatureDTO } from "../../model/dto/mailgunSignatureDTO";


export interface IRequestValidator {
    validateRequest(signatureObject: MailgunSignatureDTO): Promise<Boolean | null>
}