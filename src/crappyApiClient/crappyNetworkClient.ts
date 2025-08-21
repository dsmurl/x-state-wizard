const createCharacter = async () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await delay(2000); // Simulate a 4 seconds delay

  const success = Math.random() > 0.5;

  if (success) {
    return { message: "Character created successfully!" };
  } else {
    throw new Error("Failed to create character.");
  }
};

export const crappyNetworkClient = {
  createCharacter,
};
