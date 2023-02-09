### Character Sheets for Savage Wordls Adventure Edition

## Deployment

# Requirements
* node.js v16.14.0 or higher
* pm2 or any other Node.js daemoniser
* a protected MongoDB database
* have port 5000 available

# Configure
Once you've unzipped the files into a desired folder, follow these steps to configure the server. In local environment you may leave the ip as it is, so it will run on `localhost`.
* in `/server/config.js` replace `localhost` with your own url. Here you might also change the default port to `80` or anything you prefer.
* in `/api/config.js` change `CLIENT_ADDRESS` and `IP` array according to what you've specified in the previous step. `PORT` shall not be changed!
* in `/api/config.js` change `DB_URL` and `DB_NAME` to the connection url of your database and the name of the database respectively
* open the port that your server will be running on. On ubuntu `ufw allow 3000`(instead of `300` specify your port)
* if you want to make the API acessible to other websites and services, you might add them to array `CLIENT_ADDRESSES` in `/api/config.js` and open the port `5000` (`ufw allow 5000`)

# Run
* in the `/server` folder run `pm2 start index.js -n "SW_SERVER` (or use an alternative daemoniser of your choise)
* in the `/api` folder run `pm2 start index.js -n "SW_API` (or use an alternative daemoniser of your choise)

If you follow all the steps correctly, the app will be running on the port and adress you've specified in `/server/config.js`, by default - https://localhost:3000