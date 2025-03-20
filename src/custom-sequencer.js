class CustomSequencer {
  sort (tests) {
    return tests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1))
  }

  cacheResults () {}
}

export default CustomSequencer
