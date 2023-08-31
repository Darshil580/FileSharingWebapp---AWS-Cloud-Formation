import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    
    const tableName = 'files_metadata'; // Replace with your actual DynamoDB table name

    const params = {
      TableName: tableName,
      FilterExpression: '#status = :statusValue',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':statusValue': 'active',
      }

    };

    // Scan the DynamoDB table to get all "active" items
    const scanCommand = new ScanCommand(params);
    const result = await docClient.send(scanCommand);
    // console.log(result);

    // Update the status based on timestamp
    const updatedItems = result.Items.map(item => {
      const currentTime = new Date().getTime();
      const itemTime = new Date(item.timestamp).getTime();
      const differenceInHours = (currentTime - itemTime) / (1000 * 60 * 60); // Convert difference to hours

      if (differenceInHours > 24) {
        item.status = 'expired';
      }

      return item;
    });
    
    // console.log(updatedItems);

    // Write the updated items back to the DynamoDB table
    const batchWriteParams = {
      RequestItems: {
        [tableName]: updatedItems.map(item => ({
          PutRequest: {
            Item: {
              accessCode:{S:item.accessCode},
              timestamp:{N:item.timestamp.toString()},
              email:{S:item.email},
              fileName:{S:item.fileName},
              fileUrl:{S:item.fileUrl},
              status:{S:item.status}
            }
          },
        })),
      },
    };
    
    console.log(batchWriteParams);

    // Use BatchWriteItemCommand, not dynamoDB.batchWrite
    const batchWriteCommand = new BatchWriteItemCommand(batchWriteParams);
    await client.send(batchWriteCommand);

     return {
        statusCode: 200,
        // body: JSON.stringify(result.Items)
      };
  } 
  catch (err) {
    
    console.log(err);
    
    return {
      statusCode: 400,
      body: err
    };
    
  }
};
