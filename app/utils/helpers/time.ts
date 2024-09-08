var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

var today = new Date();

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

var sevenDays = new Date();
sevenDays.setDate(sevenDays.getDate() + 7);

var eightDays = new Date();
eightDays.setDate(eightDays.getDate() + 8);

export { yesterday, today, tomorrow, sevenDays, eightDays };
