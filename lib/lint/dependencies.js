module.exports = function getDependenciesErrors (ana, inModules, analysis, file, resourceModules) {
  // Required dependencies in source that are missing in ResourceModules
  // or not defined in the source (M.define)
  // (Using M.require, require)
  if (ana.requires && ana.requires.length) {
    return ana.requires.reduce((errs, mfId) => {
      // Find out which file defines mfId (if any)
      const whoDefines = Object.keys(analysis.files).map((f) => [f, analysis.files[f]])
        .filter(([f, fa]) =>
          fa.defines && Array.isArray(fa.defines) &&
          fa.defines.indexOf(mfId) > -1)

      if (whoDefines.length > 1) {
        errs.push({kind: 'multiple_defines', id: mfId, where: whoDefines})
      } else if (whoDefines.length === 0) {
        errs.push({kind: 'not_defined', id: mfId, where: whoDefines})
      } else {
        const [definer] = whoDefines[0]

        const getDependenciesWithFile = (scriptToFind, moduleName, module, source) => {
          if (!module) return []

          let found = []
          if (module.scripts && module.scripts.indexOf(scriptToFind) > -1) {
            found.push(moduleName)
          }

          if (module.dependencies) {
            module.dependencies.forEach((dep) => {
              found = found.concat(getDependenciesWithFile(scriptToFind, dep, resourceModules[dep], source))
            })
          }
          return found
        }

        // Traverse dependencies of the RLModules where source file is used
        // and check file that defines is there somewhere
        inModules.forEach(([name, module]) => {
          // Script defined before me, or check my dependencies for it
          const inDependencies = getDependenciesWithFile(definer, name, module, file)
            .filter((v, i, arr) => arr.indexOf(v) === i)
          if (inDependencies.length > 1) {
            errs.push({kind: 'file_in_multiple_dependencies', id: mfId, where: [definer, inDependencies]})
          } else if (inDependencies.length === 0) {
            errs.push({kind: 'not_found', id: mfId, where: definer})
          }
        })
      }

      return errs
    }, [])
  }
}