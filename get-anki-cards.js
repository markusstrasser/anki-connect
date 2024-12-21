const getAllCardInfo = async (query) => {
  const findResponse = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "findCards",
      version: 6,
      params: { query },
    }),
  });

  const { result: cardIds } = await findResponse.json();

  if (!cardIds.length) {
    return { result: [] };
  }

  const infoResponse = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "cardsInfo",
      version: 6,
      params: { cards: cardIds },
    }),
  });

  return infoResponse.json();
};

const moveCardToDeck = async (cardId, newDeckName) => {
  const response = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "changeDeck",
      version: 6,
      params: {
        cards: [cardId],
        deck: newDeckName,
      },
    }),
  });
  return response.json();
};

const formatCardInfo = (card) => ({
  // Card identifiers
  cardId: card.cardId,
  noteId: card.noteId,

  // Content
  modelName: card.modelName,
  deck: card.deckName,
  fields: Object.entries(card.fields).reduce((acc, [key, value]) => {
    acc[key] = {
      value: value.value,
      order: value.order,
      rtl: value.rtl,
    };
    return acc;
  }, {}),

  // Review statistics
  due: card.due,
  interval: card.interval,
  factor: card.factor,
  reps: card.reps,
  lapses: card.lapses,
  left: card.left,

  // Card state
  suspended: card.queue === -1,
  queue: card.queue,
  type: card.type,
  ivl: card.ivl,

  // Timestamps
  dueDate: card.due ? new Date(card.due * 1000).toISOString() : null,
  lastModified: new Date(card.mod * 1000).toISOString(),

  // Additional info
  tags: card.tags,
  flagged: card.flags,
  warned: card.warned,
  orderModified: card.odue,
  originalDue: card.odue,
  userModified: card.usn,
});

const main = async () => {
  try {
    // Get specific card info (using the ID from your example)
    console.log("\nFetching card details...");
    const cardInfo = await getAllCardInfo("cid:1730246703965");
    console.log("Card details:", cardInfo.result?.map(formatCardInfo));

    // Move the card to 'temp' deck
    console.log("\nMoving card to temp deck...");
    const moveResult = await moveCardToDeck(1730246703965, "temp");
    console.log("Move result:", moveResult);

    // Verify the move
    console.log("\nVerifying card location...");
    const verifyCard = await getAllCardInfo("cid:1730246703965");
    console.log(
      "Updated card details:",
      verifyCard.result?.map(formatCardInfo)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
};

main();
