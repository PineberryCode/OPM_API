describe('PATCH /api/actor/updateWeight', () => {
    test('Actor weight was updated', async () => {
        const data = {
            called: "Flashy Flash",
            weight: 80
        }

        await api
            .patch(`/api/actor/updateWeight`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .send(data)
    })
})