import { SSM } from 'aws-sdk';
import { GetParameterResult } from 'aws-sdk/clients/ssm';


export default class AWSHelper {
    /**
     * 
     * @param parameterPath path to ssm parameter
     * @returns Value of ssm parameter
     */
    static async getSsmParameterValue(parameterPath: string): Promise<string> {
        const ssmClient = new SSM();
        let parameterResponse: GetParameterResult = await ssmClient.getParameter({
            Name: parameterPath,
            WithDecryption: true,
        }).promise();
        return parameterResponse.Parameter.Value;
    }

}
