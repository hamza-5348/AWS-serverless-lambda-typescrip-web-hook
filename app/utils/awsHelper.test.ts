import AWSMock from 'aws-sdk-mock';
import sinon from 'sinon';

import AWSHelper from "./AwsHelper"

describe("AwsHelper", () => {

    afterEach(() => {
        AWSMock.restore();
        sinon.restore();
    });


    it("should return the parameter value", async () => {
        const dummyParamterValue = { Parameter: { Value: "paramter-value" } }
        const getParameterStub = sinon.stub().returns(Promise.resolve(dummyParamterValue))
        AWSMock.mock('SSM', 'getParameter', getParameterStub);
        const dummyParameterPath = "dev/ssm/path";
        const parameterValue = await AWSHelper.getSsmParameterValue(dummyParameterPath);
        expect(parameterValue).toEqual(dummyParamterValue.Parameter.Value)
        expect(getParameterStub.callCount).toEqual(1);
        
    })
})