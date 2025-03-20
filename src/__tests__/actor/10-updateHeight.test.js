describe('PATCH /api/actor/updateHeight', () => {
    test('Actor height was updated', async () => {
        const data = {
            called: "Flashy Flash",
            height: 180
        }

        await api
            .patch(`/api/actor/updateHeight`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .send(data)
    })
})