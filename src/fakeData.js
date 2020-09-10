import faker from "faker";
const generated = []

export const getUser = index => {
  if (!generated[index]) {
    let firstName = faker.name.firstName()
    let lastName = faker.name.lastName()
    generated[index] = {
      height: Math.random() * 70 + 50,
      bg: Math.floor(Math.random() * 16777215).toString(16),
      name: `${firstName} ${lastName}`,
      initials: `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`,
      description: faker.company.catchPhrase(),
      bgColor: faker.commerce.color(),
      fgColor: faker.commerce.color(),
      longText: faker.lorem.paragraphs(4),
      avatar: faker.internet.avatar(),
    }
  }
  return generated[index]
}