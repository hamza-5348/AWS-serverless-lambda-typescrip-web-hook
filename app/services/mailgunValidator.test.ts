import sinon from 'sinon';
import { MailgunSignatureDTO } from '../model/dto/mailgunSignatureDTO';
import AWSHelper from '../utils/awsHelper';
import MailgunValidator from './mailgunValidator';


describe("MailgunValidator", () => {

    afterEach(() => {
        sinon.restore();
    });

    it("should validate request if correct paramters are passed ", async () => {
        // const cryptoStub = sinon.stub(crypto,'createHmac').returns()

        const getMailgunSigningKeyStub = sinon.stub(MailgunValidator.prototype, <any>'getMailgunSigningKey')
            .returns(Promise.resolve("dummy-signing-key"))
        const mailgunValidator = new MailgunValidator();

        const signatureObject: MailgunSignatureDTO = {
            token: "1f85f67e83fdc459fa2bc60601eb7a4658cb68b11498eacb4f",
            timestamp: 1633818590,
            signature: "17e3ab00f1d5223d647cda42cb52e0e609f0bbcafc1f14d54bc3c146a60e612a"
        }
        const isValidate = await mailgunValidator.validateRequest(signatureObject);
        expect(getMailgunSigningKeyStub.callCount).toEqual(1);

        console.log("isValidate = ", isValidate)


    })

    it("getMailgunSigningKey should return value", async () => {
        const getSsmStub = sinon.stub(AWSHelper, 'getSsmParameterValue').returns(Promise.resolve("dummySsmValue"))
        const mailgunValidator = new MailgunValidator();
        expect(await mailgunValidator["getMailgunSigningKey"]("dummy-ssm-path")).toEqual("dummySsmValue")
        expect(getSsmStub.callCount).toEqual(1);
    })

    it("getMailgunSigningKey should thorw error", async () => {
        const getSsmStub = sinon.stub(AWSHelper, 'getSsmParameterValue').returns(Promise.resolve("Enter your signing key"))

        const mailgunValidator = new MailgunValidator();
        try {
            await mailgunValidator["getMailgunSigningKey"]("dummy-ssm-path");
        } catch (error) {
            console.log("Validate: getMailgunSigningKey should thorw error")
            expect(getSsmStub.callCount).toEqual(1);
        }
    })

    it("should thorw error if getMailgunSigningKey throws error", async () => {

        const getMailgunSigningKeyStub = sinon.stub(MailgunValidator.prototype, <any>'getMailgunSigningKey')
            .returns(Promise.reject(new Error("Some Error")))
        const mailgunValidator = new MailgunValidator();

        expect(mailgunValidator.validateRequest(null)).rejects.toThrow("Some Error");
        expect(getMailgunSigningKeyStub.callCount).toEqual(1);

    })

})