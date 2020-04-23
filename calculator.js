const swapi = require('./swapi');

const getTime = (multiplier) => {
  const count = (
   (multiplier.includes('week') && 7)
   || (multiplier.includes('month') && 30)
   || (multiplier.includes('year') && 365)
   || (multiplier.includes('day') && 1)
  );

  if (!count) {
    throw new TypeError('Could not calculate right multipler');
  }

  return count;
};

const getStops = async (distance) => {
  const ships = await swapi.getShips();

  return ships.map((ship) => {
    if (isNaN(Number(ship.MGLT))) {
      console.error(`${ship.name}: MGLT is not castable to number.`);
      return { name: ship.name, stops: NaN };
    }

    const [count, multiplier] = ship.consumables.split(' ');
    const stops = Math.floor(
      (distance / Number(ship.MGLT)) /
      (getTime(multiplier) * Number(count) * 24)
    );

    return { name: ship.name, stops };
  });
};

module.exports = {
  getStops,
};
