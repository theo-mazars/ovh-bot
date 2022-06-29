const { WebhookClient, MessageEmbed } = require("discord.js");
const axios = require("axios");
const cron = require("node-cron");

const location = {
  bhs: "Beauharnois",
  ca: "Canada",
  fr: "Francfort",
  gra: "Gravelines",
  rbx: "Roubaix",
  sbg: "Strasbourg",
};

const server = process.env.SERVERID;
let availabilities = [];

const fetchDatas = async () => {
  const { data } = await axios(
    "https://www.ovh.com/engine/apiv6/dedicated/server/datacenter/availabilities/"
  );

  if (!data) return;

  const { datacenters } = data.find((data) => data.server === server);

  const availability = datacenters?.filter(
    (dc) => dc.availability !== "unavailable"
  );

  const cleanav = availability.map((dc) => dc.datacenter);

  if (JSON.stringify(cleanav) === JSON.stringify(availabilities)) return;

  if (availability.length) {
    const webhookClient = new WebhookClient({
      url: process.env.WEBHOOK,
    });

    webhookClient.send({
      embeds: [
        new MessageEmbed({
          title: "🚨 OVH Dedicated Server available 🚨",
          description: `OVH Dedicated Servers available in \n- **${availability
            .map((a) => location[a.datacenter])
            .join(
              "**\n- **"
            )}** \nClick [here](https://eco.ovhcloud.com/fr/#filterType=range_element&filterValue=kimsufi) to see the availability`,
          color: "RED",
        }),
      ],
    });
  }

  if (availabilities.length && !availability.length) {
    const webhookClient = new WebhookClient({
      url: process.env.WEBHOOK,
    });

    webhookClient.send({
      embeds: [
        new MessageEmbed({
          title: "🚨 OVH Dedicated Server not available anymore 🚨",
          description: `You've been too slow! Wait for a new offer from [OVH](https://eco.ovhcloud.com/fr/#filterType=range_element&filterValue=kimsufi)`,
          color: "RED",
        }),
      ],
    });
  }

  availabilities = cleanav;
};

cron.schedule("* * * * *", () => {
  if (!process.env.SERVERID)
    return console.log("Missing SERVERID env variable");
  if (!process.env.WEBHOOK) return console.log("Missing WEBHOOK env variable");
  fetchDatas();
});
