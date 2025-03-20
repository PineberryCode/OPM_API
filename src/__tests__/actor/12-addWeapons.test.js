describe('PATCH /api/actor/addWeapons', () => {
    test('Actor weapons was added', async () => {
        const data = {
            called: "Garou",
            weapons: ['Manriki-Gusari']
        }

        await api
            .patch(`/api/actor/addWeapons`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .send(data)
    })
})