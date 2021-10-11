import DynamoDbStore from './dynamoDbStore';
import sinon from 'sinon';
import AWSMock from 'aws-sdk-mock';
import { IStore } from './interfaces/IStore';

describe("DynamoDbStore", () => {
    afterEach(() => {
        AWSMock.restore();
        sinon.restore();
    });

    it("should save the item if valid arguments are passed", async () => {
        const item = {};
        const tableName = process.env.TABLE_NAME;

        const putStub = sinon.stub().returns(Promise.resolve("Dummy Response"));
        AWSMock.mock('DynamoDB.DocumentClient', 'put', putStub);
        const dDbStore: IStore = new DynamoDbStore();
        const saveResponse = await dDbStore.set(item);

        expect(saveResponse).toEqual(true);
        expect(putStub.callCount).toEqual(1);
        expect(putStub.getCalls()[0].args[0]).toEqual({ TableName: tableName, Item: item });
    });

    it("should throw error if DocumentClient throws error", async () => {
        const dDbStore = new DynamoDbStore();
        const putStub = sinon.stub().returns(Promise.reject(new Error("Some Error")));
        AWSMock.mock('DynamoDB.DocumentClient', 'put', putStub);
        expect(dDbStore.set(null)).rejects.toThrow("Some Error");
    });


})