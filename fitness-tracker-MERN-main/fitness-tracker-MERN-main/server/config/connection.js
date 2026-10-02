const mongoose = require("mongoose");
const dns = require("node:dns");

mongoose.set("strictQuery", false);

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fitness-tracker";
const dnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

// Some local network DNS servers reject Atlas SRV lookups.  When configured,
// use the supplied resolvers only for MongoDB Atlas connections.
if (mongoUri.startsWith("mongodb+srv://") && dnsServers?.length) {
  dns.setServers(dnsServers);
}

mongoose.connect(mongoUri, {
  dbName: process.env.MONGODB_DB_NAME || "fitness-tracker",
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) throw err;
  console.log('Connected to MongoDB!')
}

);

module.exports = mongoose.connection;
