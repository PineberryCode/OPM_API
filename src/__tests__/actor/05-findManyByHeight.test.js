const getHeight = async (data, expectedStatus) => {
    await api
        .get(`/api/actors/height`)
        .expect(expectedStatus)
        .query(data)
        .expect('Content-Type', /application\/json/)
}

describe('GET /api/actors/height', () => {
    test('Heroes found by range of height', async () => {
        await getHeight(
            JSON.stringify({ gte: 140, lte: 250, occupation: "Hero" }), 
            200
        )
    })

    test('Monsters found by range of height', async () => {
        await getHeight(
            JSON.stringify({gte: 140, lte: 250, occupation: "Monster"}),
            200
        )
    })

    test('Actors found by height', async () => {
        await getHeight({ gte: 60 }, 200)
    })

    test('Actors not found due to the JSON bad format)', async () => {
        await api
            .get(`/api/actors/height`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .query({ occupation: "Monster" })
            .expect({
                "status": 400,
                "message": "The JSON object has a wrong format, 'gte' & 'lte' must exists"
            })
    })
})