# OVH Bot

## What to put inside .env

Environment is using 2 variables :

- `WEBHOOK`: Corresponds to the Discord webhook of your channel
- `SERVERID`: The type of server you want to check for availability

## Where to find the `SERVERID` env variable ?

1. Check in [OVH Availabilities route](https://www.ovh.com/engine/apiv6/dedicated/server/datacenter/availabilities/)
2. You'll find a big array with multiple objects
3. Inside each object you have a `server` variable

For example `"server":"22sk010"` leads to the cheapest kimsufi offer

## How to start the project

- You want to start it on your own:
  - Type `yarn start` in a terminal, while the program is running, the bot will check for availability

- You want to let it run on a server:
  - Install `pm2` with the command `npm install --global pm2`
  - Type `pm2 start` at the root folder of the project
  - Check if the program is running with `pm2 list`

## License

[GPL v3](./License)