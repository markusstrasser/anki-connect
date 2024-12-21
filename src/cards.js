const { callAnkiConnect } = require("./ankiConnect");

function stripHtml(html) {
  let text = html.replace(/<[^>]*>/g, "");
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function formatCardInfo(card, { keepHtml = false, selectedFields = null }) {
  const fullResult = {
    cardId: card.cardId,
    noteId: card.noteId,
    deckName: card.deckName,
    modelName: card.modelName,
    fields: Object.entries(card.fields).reduce((acc, [key, value]) => {
      acc[key] = {
        value: keepHtml ? value.value : stripHtml(value.value),
        order: value.order,
      };
      return acc;
    }, {}),
    tags: card.tags,
    queue: card.queue,
    due: card.due,
    interval: card.interval,
    factor: card.factor,
    reviews: card.reps,
    lapses: card.lapses,
    flags: card.flags,
    suspended: card.queue === -1,
    created: card.nid,
    modified: card.mod,
  };

  // If no fields specified, return everything
  if (!selectedFields) return fullResult;

  // Otherwise, only return requested fields
  return selectedFields.reduce((acc, field) => {
    if (field in fullResult) {
      acc[field] = fullResult[field];
    }
    return acc;
  }, {});
}

async function findCards(query) {
  try {
    if (query.cardIds && query.cardIds.length > 0) {
      const cards = await callAnkiConnect("cardsInfo", {
        cards: query.cardIds,
      });
      return cards.map((card) =>
        formatCardInfo(card, {
          keepHtml: query.html,
          selectedFields: query.fields,
        })
      );
    }

    const queryString = buildQueryString(query);
    const foundCardIds = await callAnkiConnect("findCards", {
      query: queryString,
    });

    if (!foundCardIds.length) {
      return [];
    }

    const cards = await callAnkiConnect("cardsInfo", {
      cards: foundCardIds,
    });
    return cards.map((card) =>
      formatCardInfo(card, {
        keepHtml: query.html,
        selectedFields: query.fields,
      })
    );
  } catch (error) {
    console.error("Error finding cards:", error.message);
    throw error;
  }
}

async function addCards(cards) {
  const notes = cards.map((card) => ({
    deckName: card.deck,
    modelName: "Basic",
    fields: {
      Front: card.front,
      Back: card.back,
    },
    options: { allowDuplicate: false },
    tags: card.tags || [],
  }));

  return await callAnkiConnect("addNotes", { notes });
}

async function moveCards(cardIds, targetDeck) {
  return await callAnkiConnect("changeDeck", {
    cards: Array.isArray(cardIds) ? cardIds : [cardIds],
    deck: targetDeck,
  });
}

function buildQueryString({ deck, flag, suspended }) {
  const conditions = [];
  if (deck) conditions.push(`deck:"${deck}"`);
  if (flag) conditions.push(`flag:${flag}`);
  if (suspended) conditions.push("is:suspended");
  return conditions.join(" ");
}

module.exports = { addCards, moveCards, findCards };
