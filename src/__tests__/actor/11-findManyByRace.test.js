describe('GET /api/actors/race/:race', () => {
    test('Actors found', async () => {
        const race = "Human"

        await api
            .get(`/api/actors/race/${race}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})