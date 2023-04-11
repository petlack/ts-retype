// ...
async function saveUser(
  user: {
    displayName: string;
    email: string;
    password: string
  }) {
  await db.createUser(user);
}
// ...