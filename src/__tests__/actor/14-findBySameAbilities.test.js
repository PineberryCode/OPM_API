describe('GET /api/actors/sameAbilities', () => {
    test('Actors with same abilities were found', async () => {
        await api
            .get(`/api/actors/sameAbilities`)
            .expect(200)
            .query({ ability: "Telekinesis" })
            .expect('Content-Type', /application\/json/)
    })
})