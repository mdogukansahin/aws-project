Altyapı olarak AWS'nin sağladığı şablon projeyi kullandım.
https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb

Todoları listelemek için 
GET https://ol4dad1sdl.execute-api.eu-west-1.amazonaws.com/prod/todos

Bir todo listelemek icin 
GET https://ol4dad1sdl.execute-api.eu-west-1.amazonaws.com/prod/todos/{id}

Todo eklemek veya güncellemek için
PUT https://ol4dad1sdl.execute-api.eu-west-1.amazonaws.com/prod/todos
{ "todoId": "123", "todo": "Serverless aws öğren!" }

Bir todo silmek icin
DELETE https://ol4dad1sdl.execute-api.eu-west-1.amazonaws.com/prod/todos/{id}

