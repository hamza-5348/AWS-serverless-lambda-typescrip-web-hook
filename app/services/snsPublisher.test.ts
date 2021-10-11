import AWSMock from 'aws-sdk-mock';
import sinon from 'sinon';
import { EventDTO } from '../model/dto/eventDTO';
import AWSHelper from "../utils/awsHelper";
import { SnsPublisher } from './snsPublisher';

const dummySsmValue = "ssm-dummy-value";


describe("SnsPublisher", () => {
    afterEach(() => {
        AWSMock.restore();
        sinon.restore();
    });

    it("should publish to sns if valid arguments are passed", async () => {

        const publishStub = sinon.stub().returns(Promise.resolve("Dummy Response"));
        const getSsmStub = sinon.stub(AWSHelper, 'getSsmParameterValue').returns(Promise.resolve(dummySsmValue))
        AWSMock.mock('SNS', 'publish', publishStub);
        const snsPublisher = new SnsPublisher();
        const eventDto: EventDTO = {
            Provider: "Mailgun",
            timestamp: 211221121,
            type: "email opened"
        }
        const response = await snsPublisher.publish(eventDto)
        expect(getSsmStub.callCount).toEqual(1);
        expect(publishStub.getCalls()[0].args[0]).toEqual({ Message: JSON.stringify(eventDto), TopicArn: dummySsmValue });
        expect(publishStub.getCalls()[0].returnValue).toEqual(Promise.resolve('Dummy Response'))
        expect(response).toEqual(true);

    })

    it("should thorw error if SNS.publish throws error", async () => {
        const publishStub = sinon.stub().returns(Promise.reject(new Error("Some Error")));
        const getSsmStub = sinon.stub(AWSHelper, 'getSsmParameterValue').returns(Promise.resolve(dummySsmValue))

        AWSMock.mock('SNS', 'publish', publishStub);
        const snsPublisher = new SnsPublisher();
        expect(snsPublisher.publish(null)).rejects.toThrow("Some Error");
        expect(getSsmStub.callCount).toEqual(1);

    })
})