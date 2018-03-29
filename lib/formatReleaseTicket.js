module.exports = (team, releaseDate, description, tickets) => {
  let formattedTicket = `h1. ${team} Release on ${releaseDate}

h3. Description
${description}

h3. Tickets
${tickets.join('\n')}
  `;

  return formattedTicket;

}