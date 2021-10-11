import { MessageUtil } from "./message"

describe("MessageUtil", () => {
    it("shoud return success response", () => {

        const data = { value: "dummy" };
        const response = MessageUtil.success(data);
        const expectedResponse = {
            "body": `{\"code\":200,\"message\":\"success\",\"data\":${JSON.stringify(data)}}`,
            "statusCode": 200
        }
        expect(response).toEqual(expectedResponse)
    })

    it("shoud return error response", () => {

        const errorMessage: string = "something went wrong";
        const errorCode: number = 406
        const response = MessageUtil.error(errorCode, errorMessage);
        const expectedResponse = {
            "body": `{\"code\":${errorCode},\"message\":\"${errorMessage}\"}`,
            "statusCode": errorCode
        }
        expect(response).toEqual(expectedResponse)
    })
})