describe('DELETE /api/actor/:called', () => {
    test('Actor was removed', async () => {
        const called = "Mosquito Girl"

        await api
            .delete(`/api/actor/${called}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Actor not exist', async () => {
        const called = "Something"

        await api
            .delete(`/api/actor/${called}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
    })
})