describe('GET /api/actors/age', () => {
    test('Actors between x and z years old', async () => {
        await api
            .get(`/api/actors/age`)
            .expect('Content-Type', /application\/json/)
            .query({ gte: 20, lte: 40, occupation: "Hero" })
            .expect(200)
    })
})