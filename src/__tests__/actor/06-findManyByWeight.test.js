const getWeight = async (data, expectedStatus) => {
    await api
        .get(`/api/actors/weight`)
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/)
        .query(data)
}

describe('GET /api/actors/weight', () => {
    test('Heroes found by range of weight', async () => {
        await getWeight(
            JSON.stringify({ gte: 50, lte: 80, occupation: "Hero" }),
            200
        )
    })

    test('Monsters found by range of weight', async () => {
        await getWeight(
            JSON.stringify({ gte: 80, lte: 150, occupation: "Monster" }),
            200
        )
    })

    test('Actors found by weight', async () => {
        await getWeight({ gte: 100 }, 200)
    })

    test('Actors not found due to the JSON bad format)', async () => {
        await api
            .get(`/api/actors/weight`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .query({ occupation: "Monster" })
            .expect({
                "status": 400,
                "message": "The JSON object has a wrong format, 'gte' & 'lte' must exists"
            })
    })
})