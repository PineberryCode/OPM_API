const actorExists = async (name) => {
  await api
    .get(`/api/actor/${name}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

describe('GET /api/actor/:name', () => {
  test('It should return 200 if the actor exists', async () => {
    await actorExists("Saitama")
  })

  test('It should return 200 if the actor exists (actor name with space)', async () => {
    await actorExists("Pig God")
  })

  test('It should return 200 despite this input includes a lowercase in the first letter beside the space', async () => {
    await actorExists("Flashy flash")
  })

  test('Actor not exists', async () => {
    const name = "Something"

    await api
      .get(`/api/actor/${name}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .expect({
        "status": 404,
        "message": `No one with this name: ${name}`
      })
  })
})