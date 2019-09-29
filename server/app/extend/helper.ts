module.exports = {
  socketPoll: {},
  generateCode() {
    return Math.round(Math.random() * 1000000000).toString().slice(0,4)
  },
};
