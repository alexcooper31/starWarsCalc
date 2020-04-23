const axios = require('axios');
const Telegraf = require('telegraf');

const getShips = async () => {
  const data = await axios.get('https://swapi.dev/api/starships/');
  return data.data.results;
}

const getTime = (multiplier) => {
  return (
   (multiplier.includes("week") && 7)
   || (multiplier.includes("month") && 30)
   || (multiplier.includes("year") && 365)
   || 1
  );
}

const getStops = async (distance) => {
  const ships = await getShips();

  return ships.map((ship) => {
    if (isNaN(Number(ship.MGLT))) {
      console.error(`${ship.name}: MGLT is not castable to number.`);
      return { name: ship.name, stops: NaN };
    }

    const [count, multiplier] = ship.consumables.split(' ');
    const stops = Math.floor((distance / Number(ship.MGLT) ) / ( getTime(multiplier) * Number(count) * 24 ));

    return { name: ship.name, stops };
  });
}

const bot = new Telegraf('1071124083:AAGrKr2MwetC-3H6EPcmVkbrBspY3P6903A')

bot.command('/calc', async (context) => {
  const count = Number(context.message.text.replace('/calc', ''))
  if (isNaN(count)) {
    context.reply('This is not an parsec');
  } else {
    const stops = await getStops(count);
    context.reply(stops.map((r) => {
      return `${r.name} 🚀: ${r.stops === 0 ? ' No stops at all!' : r.stops}`
    }).join('\n'));
  }
});

bot.launch();