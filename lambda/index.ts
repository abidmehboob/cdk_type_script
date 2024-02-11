export async function handler(event: any): Promise<any> {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello, World!'
      }),
    };
  }
  