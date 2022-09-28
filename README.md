## Karşılaşılan Problemler:
- Sequelize/PostgreSQL authentication fail -> i have created new user and password for database (atarikaltunn - Istanbul123)
- id attribute can not be null & id attribute does not autoincrease & null value in column "id" of relation "user" violates not-null constraint -> i added autoincreament: true & primaryKey: true at id attribute at models/User
- malformed array literal -> i think it occured because i declared my variable at pgadmin as json[] but in model as sequelize.JSON not sequelize.ARRAY(sequelize.JSON), when fixed it, the error gone but next error occured :d 
- values.map is not a function -> it is fixed when changing the updating data from json to array