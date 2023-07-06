export const extractPathsFromSwagger = (swaggerJson) => {
  const pathsWithObjects = [];

  Object.entries(swaggerJson.paths).forEach(([path, pathObject]) => {
    Object.entries(pathObject).forEach(([verb, verbObject]) => {
      pathsWithObjects.push({
        path: path,
        verb: verb,
        object: verbObject,
      });
    });
  });

  return pathsWithObjects;
};
