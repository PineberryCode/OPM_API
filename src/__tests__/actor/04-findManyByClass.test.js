describe('GET /api/actors/heroes/byClass/:rank', () => {
    test('Heroes by Rank', async () => {
        const rank = "S"

        await api
            .get(`/api/actors/heroes/byClass/${rank}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Which is this rank?', async () => {
        const rank = "F"

        await api
            .get(`/api/actors/heroes/byClass/${rank}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
            .expect({
                "status": 404,
                "message": `No one with this rank: ${rank}`
            })
    })
})