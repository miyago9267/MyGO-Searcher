export default defineEventHandler((_event) => {
  return {
    statusCode: 200,
    body: 'pong',
  }
})
