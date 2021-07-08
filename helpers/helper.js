// Neo4j does not recommend using their internal node ID for identity,
// so it's better to create one
exports.getTimeStampUID = function () {
  return Date.now();
}

exports.neo4jOptions = { disableLosslessIntegers: true };