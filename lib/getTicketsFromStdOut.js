module.exports = (stdOut) => {
  const ticketRegex = new RegExp(/([A-Z]{2,4}-[0-9]{1,5})/);
  const parseGitLog = (log) => {
    const matches = log.match(ticketRegex);
    if (matches) {
      return matches[1];
    }
    return undefined;
  }
  let matchedTickets = [];
  stdOut.split('\n').forEach(log => {
    const ticket = parseGitLog(log);
    if(ticket && !matchedTickets.includes(ticket)) {
      matchedTickets.push(ticket);
    }
  });

  return matchedTickets;

}