const MegaHash = require('megahash')

var nextIdsHash = new MegaHash();

var getNextId = function(typeId) {

    var existingNextIdValue
    existingNextIdValue = nextIdsHash.get(typeId)
    if (existingNextIdValue === undefined) {
      existingNextIdValue = 1
    }
    console.log(nextIdsHash)
  
    return existingNextIdValue
  }

  var incrementNextId = function(typeId) {

    var existingNextIdValue
    existingNextIdValue = getNextId(typeId)
    if (existingNextIdValue === undefined) {
      existingNextIdValue = 1
    }
    console.log(nextIdsHash)
  
    existingNextIdValue++
    nextIdsHash.set(typeId, existingNextIdValue)

  }

  exports.getNextId = getNextId
  exports.incrementNextId = incrementNextId