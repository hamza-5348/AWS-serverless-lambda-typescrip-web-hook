import { EventDTO } from "../../model/dto/eventDTO";

export interface IPublisher {
    publish(event: EventDTO): Promise<Boolean | null>
}