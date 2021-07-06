# Intrasudo platform

Moved to https://github.com/exunclan/intrasudo

## Setup - Normal

1. Install `node`, `npm`, `mysql`, `redis`.
2. Start `mysql` and `redis`.
3. Clone this repo -

```
git clone https://github.com/dotangad/intrasudo
```

3. Install dependencies -

```
cd intrasudo && npm i
```

4. While that's running go to the GCP console and get your OAuth Client ID and secret.
5. Create a MySQL database.
6. Copy and fill out the config files.

```
cp .env.example .env
cp config/config.example.json config/config.json
```

7. Run migrations and seeders

```
npm run db:migrate
npm run db:seed
```

8. Start the app!

```
npm run serve:dev
```

## Setup - Docker
1. Clone this repo

```
git clone https://github.com/dotangad/intrasudo
```

2. Go to the GCP console and get your OAuth Client ID and secret.
3. Copy and fill out the config files.

```
cp .env.example .env
cp config/config.docker.example.json config/config.json
```

4. Start Docker Containers

```
docker-compose up
```

5. Run migrations and seeders

```
docker ps # will return list of containers
docker-compose exec app_container_id node run db:migrate
docker-compose exec app_container_id node run seed
```
> Run this only during the first time


## TODO

- [ ] Unique Username (didn't work - 2021)
- [ ] Disqualify in Bot `!dq`
  1. Allow in all servers
  2. Allow only by admins 
- [ ] Change Finished page from `v1.0` to `v3.0`
- [x] Dockerize
- [ ] IP logging and banning
- [ ] Make navbar responsive
- [ ] Test account photo change
- [ ] Time restriction
- [ ] Timer on instructions page
