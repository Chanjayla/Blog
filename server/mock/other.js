
const faker = require("faker");
const  componentsData = [];
const count = 3;

faker.locale = "zh_CN";
for (let i = 0; i < count; i++) {
    componentsData.push({
    id: i,
    title: faker.lorem.sentence(6, 10),
    desc: faker.lorem.sentences(8),
    imageURL: "/javascript.png",
    source: "https://github.com/Chanjayla"
  });
}

module.exports = {
    componentsData: componentsData
}