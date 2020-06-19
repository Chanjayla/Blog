
const faker = require("faker");
const tagList = []
faker.locale = "zh_CN";

for (let i = 0; i < 30; i++) {
    tagList.push({
    id: i,
    name: faker.lorem.words(1),
  });
}

module.exports = {
  allTag: tagList
}