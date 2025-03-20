const getOccupation = async (occupation, expectedStatus) => {
    await api
        .get(`/api/actors/occupation/${occupation}`)
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/)
}

describe('GET /api/actors/occupation/:occupation', () => {
    test('Heroes found', async () => {
        const occupation = "Hero"

        await getOccupation(occupation, 200)
    })

    test('Monsters found', async () => {
        const occupation = "Monster"

        await getOccupation(occupation, 200)
    })

    test('Whoever not found', async () => {
        const occupation = "Mr. Robot"

        await getOccupation(occupation, 404)
    })
})