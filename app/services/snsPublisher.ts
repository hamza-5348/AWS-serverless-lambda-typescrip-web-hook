
import { EventDTO } from "../model/dto/eventDTO";
import { IPublisher } from "./interfaces/IPublisher";
import { SNS } from "aws-sdk";
import AWSHelper from "../utils/awsHelper";
export class SnsPublisher implements IPublisher {

    async publish(snsEvent: EventDTO): Promise<Boolean> {

        try {

            const topicArn: string = await AWSHelper.getSsmParameterValue(process.env.SNS_PARAMETER_PATH);
            const sns = new SNS();
            const params = {
                Message: JSON.stringify(snsEvent),
                TopicArn: topicArn
            };
            await sns.publish(params).promise()
            return true;
        } catch (error) {
            const message = `Error in publishing message to SNS, Error: ${error.message}`
            console.log(message)
            throw (new Error(message))
        }

    }

}