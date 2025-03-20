import { Router } from 'express'
import { db } from '../config/cnx.js'
import 'dotenv/config'
import { client } from '../index.js'
import authenticateToken from '../middlewares/auth.js'

const router = Router()

router.get('/api/actor/:called', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const called = req.params.called.replaceAll(/( [a-z])/g, (letter) => letter.toUpperCase())

  const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE called = $called`

  const result = await db
    .query(query, { called })
    .catch((err) => {
      res.status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
      return null
    })

  if (!result) return

  // eslint-disable-next-line eqeqeq
  if (result[0].length == 0) {
    return res.status(404)
      .json({
        status: 404,
        message: `No one with this name: ${called}`
      })
  }

  res.status(200).json(result)
})

router.patch('/api/actor/updateAge', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const { called, age, ...extra } = req.body

  if (!called || !age) {
    return res.status(400)
      .json({
        status: 400,
        message: "The attributes: 'called' or 'age' not exists"
      })
  }

  if (Object.keys(extra).length > 0) {
    return res.status(400)
      .json(JSON.stringify({
        status: 400,
        message: 'Body bad format'
      }))
  }

  const result = await db
    .query(
      `UPDATE ${process.env.DB_TABLE} SET age = <int>$age WHERE called = $called RETURN AFTER`,
      { age, called }
    )
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (result[0].length == 0) {
    return res.status(404).json({
      status: 404,
      message: `${called} not exist`
    })
  }

  res.status(200).json(result)
})

router.get('/api/actors/occupation/:occupation', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const occupation = req.params.occupation

  const result = await db
    .query(
      `SELECT * FROM ${process.env.DB_TABLE} WHERE status.occupation = $occupation`,
      { occupation }
    ).catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (result[0].length == 0) {
    return res.status(404)
      .json({
        status: 404,
        message: `No one with this occupation: ${occupation}`
      })
  }

  return res.status(200).json(result)
})

router.get('/api/actors/heroes/byClass/:rank', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const rank = req.params.rank

  const result = await db
    .query(
      `SELECT * FROM ${process.env.DB_TABLE} WHERE string::slice(status.rank ?? '', 0, 1) = string::uppercase($rank)`,
      { rank }
    ).catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (result[0].length == 0) {
    return res.status(404)
      .json({
        status: 404,
        message: `No one with this rank: ${rank}`
      })
  }

  res.status(200).json(result)
})

router.get('/api/actors/height', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  // `gte`: greater than or equal
  // `lte`: less than or equal
  const { gte, lte, occupation } = req.query

  let query = `SELECT * FROM ${process.env.DB_TABLE} WHERE `

  if (!gte && !lte && occupation) {
    return res.status(400).json({
      status: 400,
      message: "The JSON object has a wrong format, 'gte' & 'lte' must exists"
    })
  }

  query = (occupation) ? query += 'status.occupation = $occupation AND ' : query

  if (gte && !lte) {
    query += 'height >= $gte'
  } else {
    query += 'height <= $lte'
  }

  if (gte && lte) query += 'height >= gte AND height <= lte'

  const result = await db.query(query, { gte, lte, occupation })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.get('/api/actors/weight', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  // `gte`: greater than or equal
  // `lte`: less than or equal
  const { gte, lte, occupation } = req.query

  if (!gte && !lte && occupation) {
    return res.status(400).json({
      status: 400,
      message: "The JSON object has a wrong format, 'gte' & 'lte' must exists"
    })
  }

  let query = `SELECT * FROM ${process.env.DB_TABLE} WHERE `

  query = (occupation) ? query += 'status.occupation = $occupation AND ' : query

  if (gte && !lte) {
    query += 'weight >= $gte'
  } else {
    query += 'weight <= $lte'
  }

  if (gte && lte) query += 'weight >= $gte AND weight <= $lte'

  const result = await db.query(query, { gte, lte, occupation })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.patch('/api/actor/addAbilities', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const { called, possiblyAbilities, ...extra } = req.body

  if (!called || !possiblyAbilities) {
    return res.status(400).json({
      status: 400,
      message: "The attributes: 'called' or 'abilities' not exists"
    })
  }

  if (Object.keys(extra).length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Body bad format',
      extraFields: Object.keys(extra)
    })
  }

  const convertedAbilitiesToArrayByUser = Array.isArray(possiblyAbilities) ? possiblyAbilities : [possiblyAbilities]

  const prevQuery = `SELECT skills.abilities AS skills FROM ${process.env.DB_TABLE} WHERE called = $called`

  const abilities = await db.query(prevQuery, { called })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (abilities[0].length == 0) {
    return res
      .status(404)
      .json({
        status: 404,
        message: 'Actor not found'
      })
  }

  if (convertedAbilitiesToArrayByUser.some((item) => abilities[0][0].skills.includes(item))) {
    return res.status(409)
      .json({
        status: 409,
        message: 'Duplicated abilities'
      })
  }

  const query = `UPDATE ${process.env.DB_TABLE} SET skills.abilities += $validAbilities WHERE called = $called`

  const result = await db.query(`${query} RETURN AFTER`, { called, convertedAbilitiesToArrayByUser })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.delete('/api/actor/removeAbilities', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const { called, posiblyAbilities, ...extra } = req.body

  if (!called || !posiblyAbilities) {
    return res.status(400).json({
      status: 400,
      message: "The attributes: 'called' or 'abilities' not exists"
    })
  }

  if (Object.keys(extra).length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Body bad format',
      extraFields: Object.keys(extra)
    })
  }

  const validAbilities = Array.isArray(posiblyAbilities) ? posiblyAbilities : [posiblyAbilities]

  const prevQuery = `SELECT skills.abilities AS skills FROM ${process.env.DB_TABLE} WHERE called = $called`

  const thereAbilities = await db.query(prevQuery, { called })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (thereAbilities[0].length == 0) {
    return res.status(404)
      .json({
        status: 404,
        message: 'Abilities or heroe were not found'
      })
  }

  const onlySkills = thereAbilities[0].map((val) => val.skills)

  const patchOperations = validAbilities.map(ability => ({
    op: 'remove',
    path: `/skills/abilities/${onlySkills[0].indexOf(ability)}`
  }))

  const query = `UPDATE ${process.env.DB_TABLE} PATCH $patchOperations WHERE called = $called RETURN AFTER`

  await db.query(query, { called, patchOperations })
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })
})

router.patch('/api/actor/updateWeight', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  // eslint-disable-next-line no-unused-vars
  const { called, weight, ...extra } = req.body

  const query = `UPDATE ${process.env.DB_TABLE} SET weight = $weight WHERE called = $called`

  const result = await db.query(`${query} RETURN AFTER`, { called, weight })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })
  res.status(200).json(JSON.stringify(result))
})

router.patch('/api/actor/updateHeight', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  // eslint-disable-next-line no-unused-vars
  const { called, height, ...extra } = req.body

  const query = `UPDATE ${process.env.DB_TABLE} SET height = $height WHERE called = $called`

  const result = await db.query(`${query} RETURN AFTER`, { called, height })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.get('/api/actors/race/:race', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const race = req.params.race

  const result = await db.query(`SELECT * FROM ${process.env.DB_TABLE} WHERE race = $race`, { race })
    .catch((err) => {
      return res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.patch('/api/actor/addWeapons', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const { called, weapons } = req.body

  const result = await db.query(
    `UPDATE ${process.env.DB_TABLE} SET weapons += $weapons WHERE called = $called RETURN AFTER`,
    { weapons, called }
  )
    .catch((err) => {
      res
        .status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
      return null
    })

  if (!result) return

  res.status(200).json(result)
})

router.get('/api/actors/age', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const { gte, lte, occupation } = req.query

  const query = `
        SELECT * FROM ${process.env.DB_TABLE} 
        WHERE status.occupation = $occupation 
        AND age >= <int> $gte 
        AND age <= <int> $lte
    `

  const result = await db.query(query, { gte, lte, occupation })
    .catch((err) => {
      return res.status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

router.get('/api/actors/sameAbilities', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const { ability } = req.query

  var cloneAbility = ability

  if (typeof cloneAbility === 'string') {
    cloneAbility = [ability]
  }

  const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE array::intersect(skills.abilities, $cloneAbility)`

  const result = await db.query(query, { cloneAbility })
    .catch((err) => {
      console.error('surreal: ', err)
      return res.status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  return res.status(200).json(result)
})

router.delete('/api/actor/:called', authenticateToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const called = req.params.called

  const query = `DELETE ${process.env.DB_TABLE} WHERE called = $called RETURN BEFORE`

  const result = await db.query(query, { called })
    .catch((err) => {
      return res.status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  // eslint-disable-next-line eqeqeq
  if (result[0].length == 0) {
    return res.status(404)
      .json({
        status: 404,
        message: 'Actor not found'
      })
  }

  res.status(200).json(result)
})

router.post('/api/actor/new', authenticateToken, async (req, res) => {

  res.setHeader('Content-Type', 'application/json')

  const body = req.body

  const result = await db.create(`${process.env.DB_TABLE}`, body)
    .catch((err) => {
      return res.status(500)
        .json({
          status: 500,
          message: 'Internal Server Error',
          description: `${err}`
        })
    })

  res.status(200).json(result)
})

export default router
