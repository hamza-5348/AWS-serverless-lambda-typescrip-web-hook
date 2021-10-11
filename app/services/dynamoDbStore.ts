import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IStore } from "./interfaces/IStore";

export default class DynamoDbStore implements IStore {

    async set(item: any): Promise<Boolean> {
        try {
            const docClient = new DocumentClient();
            const params = {
                TableName: process.env.TABLE_NAME,
                Item: item
            }
            await docClient.put(params).promise();
            return true;
        } catch (error) {
            const message = `Error in setting data to Dynamo db, Error: ${error.message}`;
            console.log(message);
            throw (new Error(message));
        }

    }

}