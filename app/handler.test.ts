import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { processMailGunHook } from "./handler"

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {
        const event: APIGatewayProxyEvent = {
            body: {
                Name: "1"
            }
        } as any

        const context: Context = {

        } as any
        const result = await processMailGunHook(event, context, () => { })

        expect(result.statusCode).toEqual(406);
        // expect(result.body).toEqual(`Queries: ${JSON.stringify(event.queryStringParameters)}`);
    });
});