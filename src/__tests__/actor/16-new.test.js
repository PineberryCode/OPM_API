describe('POST /api/actor/new', () => {
    test('Actor was registered', async () => {
        const data = {
            age: 'Unknown',
            called: 'Mosquito Girl',
            gender: 'Female',
            height: 170,
            nicknames: [
                'Mosquito Girl'
            ],
            race: 'Monster',
            skills: {
                abilities: [
                    'Flight',
                    'Mosquito Swarm Control',
                    'Blood Drain'
                ],
                special: 'Blood Frenzy',
                weapons: []
            },
            status: {
                affiliation: [
                    'House of Evolution'
                ],
                occupation: 'Monster',
                rank: 'Demon Level'
            },
            weight: 55
        }

        await api
            .post(`/api/actor/new`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .send(data)
    })
})