const addAbilities = async (data, expectedStatus) => {
    await api
        .patch(`/api/actor/addAbilities`)
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/)
        .send(data)
        .timeout(90)
}

describe('PATCH /api/actor/addAbilities', () => {
    test('Actor ability was updated when his abilities is a string', async () => {
        const data = { called: "Saitama", possiblyAbilities: "Super Sneeze"}
        await addAbilities(data, 200)
    })

    test('Actor abilities were updated when his abilities is an array', async () => {
        const data = { called: "Pig God", possiblyAbilities: ['Big Mouth', 'Super Hungry'] }
        await addAbilities(data, 200)
    })

    test('Avoid duplicated abilities in a specific actor', async () => {
        const data = {
            called: "Fubuki",
            possiblyAbilities: "Telekinesis"
        }

        await api
            .patch(`/api/actor/addAbilities`)
            .expect(409)
            .expect('Content-Type', /application\/json/)
            .expect({
                "status": 409,
                "message": "Duplicated abilities"
            })
            .send(data)
            .timeout(100)
    })

    test('Actor abilities were not updated due to the JSON bad format', async () => {
        const data = { called: "Flashy Flash" }
        await addAbilities(data, 400)
    })

    test('Actor abilities were not updated because this actor does not exist', async () => {
        const data = { called: "Saitama2", possiblyAbilities: "Super whatever" }
        await addAbilities(data, 404)
    })
})