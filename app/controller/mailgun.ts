import { Context } from "aws-lambda";
import { EventDTO } from "../model/dto/eventDTO";
import { MailgunSignatureDTO } from "../model/dto/mailgunSignatureDTO";
import DynamoDbStore from "../services/dynamoDbStore";
import { IPublisher } from "../services/interfaces/IPublisher";
import { IRequestValidator } from "../services/interfaces/IRequestValidator";
import { IStore } from "../services/interfaces/IStore";
import MailgunValidator from "../services/mailgunValidator";
import { SnsPublisher } from "../services/snsPublisher";
import { MessageUtil } from "../utils/message";


const KEY_BODY = "body";
const KEY_SIGNATURE = "signature";
const KEY_EVENT_DATA = "event-data";
const KEY_TIMESTAMP = "timestamp";
const KEY_EVENT = "event";



export class MailgunController {

    private validator: IRequestValidator;
    private store: IStore;
    private publisher: IPublisher;

    constructor() {
        this.validator = new MailgunValidator();
        this.store = new DynamoDbStore();
        this.publisher = new SnsPublisher();
    }

    async processMailGunHook(event: any, _context?: Context) {


        try {
            const body: any = JSON.parse(event[KEY_BODY]);
            const signature: MailgunSignatureDTO = body[KEY_SIGNATURE];
            const eventRawData: any = body[KEY_EVENT_DATA];

            const isVerified: Boolean = await this.validator.validateRequest(signature);

            if (isVerified === false) {
                throw new Error("Not a verified mailgun signature")
            }
            const eventDto: EventDTO = {
                Provider: "Mailgun",
                timestamp: eventRawData[KEY_TIMESTAMP], // a timestamp
                type: `email ${eventRawData[KEY_EVENT]}` // pattern here of which type it was
            }

            const isPublished: Boolean = await this.publisher.publish(eventDto);
            const isSaved: Boolean = await this.store.set(eventRawData);
            return MessageUtil.success({ isVerified, isPublished, isSaved });

        } catch (error) {
            return MessageUtil.error(406, error.message);
        }

    }


}