export default () => ({
  port: parseInt(process.env.PORT!),
  database: {
    host: process.env.MONGODB_CONNECT,
  },
});
