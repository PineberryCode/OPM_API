const updatedAge = async (data, expectedStatus) => {
    await api
        .patch(`/api/actor/updateAge`)
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/)
        .send(data)
}

describe('PATCH /api/actor/updateAge', () => {
    test('Actor age was updated (age of type string)', async () => {
        const data = { called: "Saitama", age: "26" }
        await updatedAge(data, 200)
    })

    test('Actor age was updated (age of type number)', async () => {
        const data = { called: "Flashy Flash", age: 25 }
        await updatedAge(data, 200)
    })

    test('Actor age was not updated because the hero does not exist', async () => {
        const data = { called: "Saitama2", age: "25" }
        await updatedAge(data, 404)
    })

    test('Actor age was not updated because a fill does not exist', async () => {
        const data = { called: "Saitama" }
        await updatedAge(data, 400)
    })
})