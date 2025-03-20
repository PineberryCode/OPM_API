const removeAbilities = async (data, expectedStatus, timeout) => {
    await api
        .delete(`/api/actor/removeAbilities`)
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/)
        .send(data)
        .timeout(timeout)
}

describe('DELETE /api/actor/removeAbilities', () => {
    test('Some of his/her ability was removed', async () => {
        const data = { called: "Saitama", posiblyAbilities: "Super Sneeze" }

        await removeAbilities(data, 200, 100)
    })

    test('Actor abilities were removed', async () => {
        const data = { called: "Pig God", posiblyAbilities: ['Big Mouth', 'Super Hungry'] }

        await removeAbilities(data, 200, 100)
    })

    test('Actor not found', async () => {
        const data = { called: "Someone", posiblyAbilities: "Super Nothing" }

        await removeAbilities(data, 404, 100)
    })
})