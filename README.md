# Intrasudo platform

## Setup

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

## TODO

- [ ] IP logging and banning
- [ ] Make navbar responsive
- [ ] Test account photo change
- [ ] Time restriction
- [ ] Timer on instructions page
