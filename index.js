/* Copyright (c) <2019> <Tony Gonçalves> All rights reserved.
 * See LICENSE.txt for licensing details */

module.exports = function denormalize(obj) {
  var cache = {}; // Cache of already denormalized objects in "included"
  var included = extractIncluded(obj);

  console.log("INCUDED SITE:", Object.keys(included).length);

  if (obj.data.length == null) {
    // There's a single top-level object
    return denormalizeObj(obj.data, included, cache);
  }
  else {
    // We are dealing with a list of objects
    return obj.data.map(function(o) {
      return denormalizeObj(o, included, cache);
    });
  }
}


/**
 * Extracts all of the objects in the "included" key of the JSON:API response
 * into an object with a shape like:
 * {
 *   type1: { obj1Id: obj1, obj2Id: obj2, ... },
 *   type2: { obj1Id: obj1, obj2Id: obj2, ... },
 *   ...
 * }
 *
 * This will allow us to directly get at each object we need when building the
 * denormalized response, instead of iterating through the "included" array
 * multiple times.
 */
function extractIncluded(obj) {
  var included = {};

  if (obj.included == null) { return included; }

  for (var i = 0; i < obj.included.length; i++) {
    var o = obj.included[i];

    if (included[o.type] == null) {
      included[o.type] = {};
    }

    included[o.type][o.id] = o;
  }

  return included;
}


function denormalizeObj(obj, included, cache) {
  var type = obj.type;
  var cachedType = cache[type];
  if (cachedType != null) {
    var cachedObject = cachedType[obj.id];
    if (cachedObject != null) {
      return cachedObject;
    }
  }

  var k;
  var newObj = {};

  // Copy top-level keys to new obj (except attributes and relationships)
  for (k in obj) {
    if (k !== 'relationships' && k !== 'attributes') {
      newObj[k] = obj[k];
    }
  }

  // Copy attributes to top-level of new object
  // (this does nothing if there are no attributes)
  assign(newObj, obj.attributes);

  // Copy related objects to top-level of new object
  assign(
    newObj,
    denormalizeRelationships(obj.relationships, included, cache)
  );

  // Cache the denormalized object and return it
  if (cache[type] == null) { cache[type] = {}; }
  cache[type][newObj.id] = newObj;
  return newObj;
}


function denormalizeRelationships(relationships, included, cache) {
  var newRelationships = {};

  for (var k in relationships) {
    var rel = relationships[k].data;

    if (rel.length == null) { // relationship is a signle object
      var obj = isIncluded(rel, included) ? included[rel.type][rel.id] : rel;
      newRelationships[k] = denormalizeObj(obj, included, cache);
    }
    else { // relationship is an array of objects
      newRelationships[k] = rel.map(function(o) {
        o = isIncluded(o, included) ? included[o.type][o.id] : o;
        return denormalizeObj(o, included, cache);
      });
    }
  }

  return newRelationships;
}


function isIncluded(obj, included) {
  return included[obj.type] != null && included[obj.type][obj.id] != null;
}


/**
 * Replacement for Object.assign when running in ES5 environments
 */
var assign = Object.assign || function(target, source) {
  for (var k in source) { target[k] = source[k]; }
}
