"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
const uuidv4 = require('uuid/v4');
const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`, DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;
exports.handler = async (event = {}) => {
    if (!event.body) {
        return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
    }
    const editedItem = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    if (!editedItem || !editedItem.todo) {
        return { statusCode: 400, body: 'invalid request, no arguments provided' };
    }
    if (editedItem.todoId) {
        const params = {
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
        };
        try {
            await db.update(params).promise();
            return { statusCode: 204, body: '' };
        }
        catch (dbError) {
            const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
                DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
            return { statusCode: 500, body: errorResponse };
        }
    }
    else {
        editedItem.todoId = uuidv4();
        const params = {
            TableName: TABLE_NAME,
            Item: editedItem
        };
        try {
            await db.put(params).promise();
            return { statusCode: 201, body: '' };
        }
        catch (dbError) {
            const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
                DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
            return { statusCode: 500, body: errorResponse };
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLW9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVwZGF0ZS1vbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztBQUNoRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7QUFDbEQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBR2xDLE1BQU0saUJBQWlCLEdBQUcseURBQXlELEVBQ2pGLHdCQUF3QixHQUFHLCtGQUErRixDQUFDO0FBT2hILFFBQUEsT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUc3RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNmLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxxREFBcUQsRUFBRSxDQUFDO0tBQ3pGO0lBR0QsTUFBTSxVQUFVLEdBQVMsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0YsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDbkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLHdDQUF3QyxFQUFFLENBQUM7S0FDNUU7SUFJRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDckIsTUFBTSxNQUFNLEdBQVE7WUFDbEIsU0FBUyxFQUFFLFVBQVU7WUFDckIsR0FBRyxFQUFFO2dCQUNILENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU07YUFDakM7WUFDRCxnQkFBZ0IsRUFBRSxxQkFBcUI7WUFDdkMsd0JBQXdCLEVBQUU7Z0JBQ3hCLE9BQU8sRUFBRSxNQUFNO2FBQ2hCO1lBQ0QseUJBQXlCLEVBQUU7Z0JBQ3pCLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSTthQUN6QjtZQUNELFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUE7UUFHRCxJQUFJO1lBQ0YsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztTQUN0QztRQUFDLE9BQU8sT0FBTyxFQUFFO1lBQ2hCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUsscUJBQXFCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUM1Ryx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7WUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDO1NBQ2pEO0tBQ0Y7U0FBTTtRQUVMLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQUc7WUFDYixTQUFTLEVBQUUsVUFBVTtZQUNyQixJQUFJLEVBQUUsVUFBVTtTQUNqQixDQUFDO1FBRUYsSUFBSTtZQUNGLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMvQixPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDdEM7UUFBQyxPQUFPLE9BQU8sRUFBRTtZQUNoQixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxLQUFLLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDNUcsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO1lBQy9DLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQztTQUNqRDtLQUNGO0FBSUgsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuY29uc3QgZGIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCBUQUJMRV9OQU1FID0gcHJvY2Vzcy5lbnYuVEFCTEVfTkFNRSB8fCAnJztcbmNvbnN0IFBSSU1BUllfS0VZID0gcHJvY2Vzcy5lbnYuUFJJTUFSWV9LRVkgfHwgJyc7XG5jb25zdCB1dWlkdjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XG5cblxuY29uc3QgUkVTRVJWRURfUkVTUE9OU0UgPSBgRXJyb3I6IFlvdSdyZSB1c2luZyBBV1MgcmVzZXJ2ZWQga2V5d29yZHMgYXMgYXR0cmlidXRlc2AsXG4gIERZTkFNT0RCX0VYRUNVVElPTl9FUlJPUiA9IGBFcnJvcjogRXhlY3V0aW9uIHVwZGF0ZSwgY2F1c2VkIGEgRHluYW1vZGIgZXJyb3IsIHBsZWFzZSB0YWtlIGEgbG9vayBhdCB5b3VyIENsb3VkV2F0Y2ggTG9ncy5gO1xuXG5pbnRlcmZhY2UgVG9kbyB7XG4gIHRvZG9JZD86IHN0cmluZ1xuICB0b2RvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+ID0+IHtcblxuXG4gIGlmICghZXZlbnQuYm9keSkge1xuICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDQwMCwgYm9keTogJ2ludmFsaWQgcmVxdWVzdCwgeW91IGFyZSBtaXNzaW5nIHRoZSBwYXJhbWV0ZXIgYm9keScgfTtcbiAgfVxuXG5cbiAgY29uc3QgZWRpdGVkSXRlbTogVG9kbyA9IHR5cGVvZiBldmVudC5ib2R5ID09ICdvYmplY3QnID8gZXZlbnQuYm9keSA6IEpTT04ucGFyc2UoZXZlbnQuYm9keSk7XG4gIGlmICghZWRpdGVkSXRlbSB8fCAhZWRpdGVkSXRlbS50b2RvKSB7XG4gICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogNDAwLCBib2R5OiAnaW52YWxpZCByZXF1ZXN0LCBubyBhcmd1bWVudHMgcHJvdmlkZWQnIH07XG4gIH1cblxuXG5cbiAgaWYgKGVkaXRlZEl0ZW0udG9kb0lkKSB7XG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XG4gICAgICBUYWJsZU5hbWU6IFRBQkxFX05BTUUsXG4gICAgICBLZXk6IHtcbiAgICAgICAgW1BSSU1BUllfS0VZXTogZWRpdGVkSXRlbS50b2RvSWRcbiAgICAgIH0sXG4gICAgICBVcGRhdGVFeHByZXNzaW9uOiBgc2V0ICAjdG9kbyA9IDp0b2RvIGAsXG4gICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHtcbiAgICAgICAgJyN0b2RvJzogJ3RvZG8nXG4gICAgICB9LFxuICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAnOnRvZG8nOiBlZGl0ZWRJdGVtLnRvZG9cbiAgICAgIH0sXG4gICAgICBSZXR1cm5WYWx1ZXM6ICdVUERBVEVEX05FVydcbiAgICB9XG5cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYi51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDQsIGJvZHk6ICcnIH07XG4gICAgfSBjYXRjaCAoZGJFcnJvcikge1xuICAgICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IGRiRXJyb3IuY29kZSA9PT0gJ1ZhbGlkYXRpb25FeGNlcHRpb24nICYmIGRiRXJyb3IubWVzc2FnZS5pbmNsdWRlcygncmVzZXJ2ZWQga2V5d29yZCcpID9cbiAgICAgICAgRFlOQU1PREJfRVhFQ1VUSU9OX0VSUk9SIDogUkVTRVJWRURfUkVTUE9OU0U7XG4gICAgICByZXR1cm4geyBzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IGVycm9yUmVzcG9uc2UgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG5cbiAgICBlZGl0ZWRJdGVtLnRvZG9JZCA9IHV1aWR2NCgpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIFRhYmxlTmFtZTogVEFCTEVfTkFNRSxcbiAgICAgIEl0ZW06IGVkaXRlZEl0ZW1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRiLnB1dChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMSwgYm9keTogJycgfTtcbiAgICB9IGNhdGNoIChkYkVycm9yKSB7XG4gICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0gZGJFcnJvci5jb2RlID09PSAnVmFsaWRhdGlvbkV4Y2VwdGlvbicgJiYgZGJFcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdyZXNlcnZlZCBrZXl3b3JkJykgP1xuICAgICAgICBEWU5BTU9EQl9FWEVDVVRJT05fRVJST1IgOiBSRVNFUlZFRF9SRVNQT05TRTtcbiAgICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDUwMCwgYm9keTogZXJyb3JSZXNwb25zZSB9O1xuICAgIH1cbiAgfVxuXG5cblxufTtcbiJdfQ==