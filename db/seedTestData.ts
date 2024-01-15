import { PrismaClient } from '@prisma/client';
// TODO: drop tables and recreate them before seeding

const prisma = new PrismaClient();

async function addTestUsers() {
  const testUser1 = await prisma.user.create({
    data: {
      username: 'john@noemail.com',
      password: 'abc123',
      jokes: {}
    }
  });
  console.log('Created new user: ', testUser1);

  const testUser2 = await prisma.user.create({
    data: {
      username: 'jane@noemail.com',
      password: 'abc123',
      jokes: {}
    }
  });
  console.log('Created new user: ', testUser2);

  const testUser3 = await prisma.user.create({
    data: {
      username: 'rick@noemail.com',
      password: 'abc123',
      jokes: {}
    }
  });
  console.log('Created new user: ', testUser3);
}

async function addTestJokes() {
  const testJoke1 = await prisma.joke.create({
    data: {
      content: 'What do you call a very small valentine? A valen-tiny!!!'
    }
  });
  console.log('Created new joke: ', testJoke1);

  const testJoke2 = await prisma.joke.create({
    data: {
      content:
        'What did the dog say when he rubbed his tail on the sandpaper? Rough, rough!'
    }
  });
  console.log('Created new joke: ', testJoke2);

  const testJoke3 = await prisma.joke.create({
    data: {
      content: "Why don't sharks like to eat clowns? Because they taste funny!"
    }
  });
  console.log('Created new joke: ', testJoke3);

  const testJoke4 = await prisma.joke.create({
    data: {
      content:
        "Why don't scientists trust atoms? Because they make up everything."
    }
  });
  console.log('Created new joke: ', testJoke4);

  const testJoke5 = await prisma.joke.create({
    data: {
      content:
        'Why did the chicken go to the seance? To talk to the other side.'
    }
  });
  console.log('Created new joke: ', testJoke5);

  const testJoke6 = await prisma.joke.create({
    data: {
      content: "Why don't some fish play piano? They get lost in the scales."
    }
  });
  console.log('Created new joke: ', testJoke6);
}

async function connectUsersWithJokes(userId: number, jokeIds: number[]) {
  try {
    for (const jokeId of jokeIds) {
      await prisma.userJoke.create({
        data: {
          userId: userId,
          jokeId: jokeId
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function seedUserJokes() {
  try {
    await connectUsersWithJokes(1, [1, 2, 3]);
    await connectUsersWithJokes(2, [2, 3]);
    await connectUsersWithJokes(3, [1, 2]);
  } catch (error) {
    console.error(error);
  }
}

addTestUsers()
  .then(() => addTestJokes())
  .then(() => seedUserJokes())
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
