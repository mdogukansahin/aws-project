const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
const uuidv4 = require('uuid/v4');


const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

interface Todo {
  todoId?: string
  todo: string
}

export const handler = async (event: any = {}): Promise<any> => {


  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }


  const editedItem: Todo = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  if (!editedItem || !editedItem.todo) {
    return { statusCode: 400, body: 'invalid request, no arguments provided' };
  }



  if (editedItem.todoId) {
    const params: any = {
      TableName: TABLE_NAME,
      Key: {
        [PRIMARY_KEY]: editedItem.todoId
      },
      UpdateExpression: `set  #todo = :todo `,
      ExpressionAttributeNames: {
        '#todo': 'todo'
      },
      ExpressionAttributeValues: {
        ':todo': editedItem.todo
      },
      ReturnValues: 'UPDATED_NEW'
    }


    try {
      await db.update(params).promise();
      return { statusCode: 204, body: '' };
    } catch (dbError) {
      const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
        DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
      return { statusCode: 500, body: errorResponse };
    }
  } else {

    editedItem.todoId = uuidv4();
    const params = {
      TableName: TABLE_NAME,
      Item: editedItem
    };

    try {
      await db.put(params).promise();
      return { statusCode: 201, body: '' };
    } catch (dbError) {
      const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
        DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
      return { statusCode: 500, body: errorResponse };
    }
  }



};
