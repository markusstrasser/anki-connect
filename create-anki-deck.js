const createDeck = async (deckName) => {
  const response = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createDeck",
      version: 6,
      params: {
        deck: deckName,
      },
    }),
  });
  return response.json();
};

const addNote = async ({ deckName, front, back }) => {
  const response = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "addNote",
      version: 6,
      params: {
        note: {
          deckName,
          modelName: "Basic",
          fields: {
            Front: front,
            Back: back,
          },
          options: {
            allowDuplicate: false,
          },
          tags: [],
        },
      },
    }),
  });
  return response.json();
};

const main = async () => {
  try {
    // Create a new deck
    const deckName = "Test::Programming";
    console.log("Creating deck:", deckName);
    await createDeck(deckName);

    // Add a sample note
    console.log("Adding sample note...");
    const result = await addNote({
      deckName,
      front: "What is a closure in JavaScript?",
      back: "A closure is the combination of a function and the lexical environment within which that function was declared.",
    });

    console.log("Note added successfully:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

main();
