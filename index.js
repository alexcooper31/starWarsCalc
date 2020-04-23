const Telegraf = require('telegraf');

const config = require('./config');
const calculator = require('./calculator');

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN)

bot.command('/calc', async (context) => {
  const count = Number(context.message.text.replace('/calc', ''))

  if (isNaN(count)) {
    context.reply('This is not a parsec');
  } else {
    const stops = await calculator.getStops(count);

    context.reply(stops.map((r) => {
      return `${r.name} 🚀: ${r.stops === 0 ? ' No stops at all!' : r.stops}`
    }).join('\n'));
  }
});

bot.telegram.setWebhook(config.WEBHOOK_URL);
bot.startWebhook('/', null, config.PORT);