# SUMMARY
- - -
It's a REST API about the characters of OPM (One Punch Man), It includes some features such as:
- Character skills
- Nicknames
- Age and special ability
- Physical attributes (Height & weight)
- Human & monster clasification.
- Weapons and ranking system
- - -
### All routes
- **GET** /api/generateCode
- **POST** /api/generateToken
- **GET** /api/actor/:name
- **PATCH** /api/actor/updateAge
- **GET** /api/actors/occupation/:occupation
- **GET** /api/actors/heroes/byClass/:letter
- **GET** /api/actors/height?gte=:min&lte=:max
- **GET** /api/actors/weight?gte=:min&lte=:max
- **PATCH** /api/actor/addAbilities
- **DELETE** /api/actor/removeAbilities
- **PATCH** /api/actor/updateWeight
- **PATCH** /api/actor/updateHeight
- **GET** /api/actors/race/:race
- **PATCH** /api/actor/addWeapons
- **GET** /api/actors/age?gte=:min&lte=:max
- **GET** /api/actors/sameAbilities
- **DELETE** /api/actor/:name
- **POST** /api/actor/new
- - -

## Build your own with Surreal Cloud
Below are the standard environment variables:
```javascript
DB_USER=your_username
DB_PASS=your_password
URL_INSTANCE=wss://your.provided.link.surreal.cloud
DB_NM=your_namespace
DB_NAME=your_db_name
DB_TABLE=your_table_name
URL_INSTANCE_TEST=http://127.0.0.1:8000/rpc
SALT=your.secret.token
FROM_EMAIL=you@gmail.com
APP_GMAIL_PASSWORD=your gmail password
```
- - -
## Data
After creating an instance in Surreal Cloud, you can copy and paste this <a href="https://gist.github.com/PineberryCode/f337ded8f8be549b92a8b4b52e47af29" target="_blank" rel="noopener noreferrer">data</a>.

- - -
## Run Tests
First, you need to install SurrealDB on your device. Then, you can copy and paste the command below to initialize SurrealDB:
```SHELL
surreal start --user root --pass root --bind 0.0.0.0:8000 rocksdb:/your/path/my-local-db/
```
Now, you can run the tests properly: 
```
npm run test
```

> [!IMPORTANT]
> Comming soon, add new attributes in a specific record ;).