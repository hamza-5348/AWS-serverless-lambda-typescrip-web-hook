import sinon from "sinon";
import { MailgunController } from "./mailgun"
import AWSMock from 'aws-sdk-mock';
import MailgunValidator from '../services/mailgunValidator'
import { MessageUtil } from "../utils/message";
import { SnsPublisher } from "../services/snsPublisher";
import DynamoDbStore from "../services/dynamoDbStore";

describe("MailgunController", () => {
    afterEach(() => {
        AWSMock.restore();
        sinon.restore();
    });


    it("should return success response", async () => {
        const body = {
            "event-data": {
                timestamp: 10000222,
                event: "opened"
            }
        }
        const successResponse = { statusCode: 200, body: "success" };
        const jsonParseStub = sinon.stub(JSON, 'parse').returns(body)
        const validateStub = sinon.stub(MailgunValidator.prototype, 'validateRequest').returns(Promise.resolve(true))
        const publishStub = sinon.stub(SnsPublisher.prototype, 'publish').returns(Promise.resolve(true))
        const setStub = sinon.stub(DynamoDbStore.prototype, 'set').returns(Promise.resolve(true))
        const successStub = sinon.stub(MessageUtil, 'success').returns(successResponse);
        const mailgunController = new MailgunController();

        const testEvent = {
            body: JSON.stringify(body)
        }
        console.log("test event =", testEvent)
        const res = await mailgunController.processMailGunHook(testEvent)
        expect(validateStub.callCount).toEqual(1);
        expect(jsonParseStub.callCount).toEqual(1);
        expect(publishStub.callCount).toEqual(1);
        expect(setStub.callCount).toEqual(1);
        expect(successStub.callCount).toEqual(1);
        expect(res).toEqual(successResponse);
    })

    it("should return error on invalid signature", async () => {
        const jsonParseStub = sinon.stub(JSON, 'parse').returns("")
        const validateStub = sinon.stub(MailgunValidator.prototype, 'validateRequest').returns(Promise.resolve(false))
        const errorResponseBody = { statusCode: 406, body: "" }
        const errorResponseStub = sinon.stub(MessageUtil, 'error').returns(errorResponseBody);
        const mailgunController = new MailgunController();

        const body = {
            "event-data": {
                timestamp: 10000222,
                event: "opened"
            }
        }
        const testEvent = {
            body: JSON.stringify(body)
        }
        const res = await mailgunController.processMailGunHook(testEvent)
        expect(validateStub.callCount).toEqual(1);
        expect(jsonParseStub.callCount).toEqual(1);
        expect(errorResponseStub.callCount).toEqual(1);
        expect(res).toEqual(errorResponseBody);
    })
})