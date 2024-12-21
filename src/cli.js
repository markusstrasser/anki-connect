#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { addCards, moveCards, findCards } = require("./cards");

yargs(hideBin(process.argv))
  .command(
    "add",
    "Add new cards",
    (yargs) => {
      return yargs.option("cards", {
        type: "array",
        describe: "Array of card objects (JSON string)",
        demandOption: true,
      });
    },
    async (argv) => {
      try {
        const cards = JSON.parse(argv.cards);
        const result = await addCards(cards);
        console.log("Cards added:", result);
      } catch (error) {
        console.error("Failed to add cards:", error.message);
      }
    }
  )
  .command(
    "move",
    "Move cards to another deck",
    (yargs) => {
      return yargs
        .option("cards", {
          type: "array",
          describe: "Card IDs to move",
          demandOption: true,
        })
        .option("deck", {
          type: "string",
          describe: "Target deck name",
          demandOption: true,
        });
    },
    async (argv) => {
      try {
        await moveCards(argv.cards, argv.deck);
        console.log("Cards moved successfully");
      } catch (error) {
        console.error("Failed to move cards:", error.message);
      }
    }
  )
  .command(
    "find",
    "Find cards",
    (yargs) => {
      return yargs
        .option("cardIds", {
          type: "array",
          describe: "Array of card IDs to find",
          coerce: (ids) => ids.map(Number),
        })
        .option("deck", {
          type: "string",
          describe: "Deck name to search in",
        })
        .option("flag", {
          type: "number",
          describe: "Flag value (0-4)",
        })
        .option("suspended", {
          type: "boolean",
          describe: "Find suspended cards",
        })
        .option("html", {
          type: "boolean",
          describe: "Keep HTML in card content",
          default: false,
        })
        .option("fields", {
          type: "string",
          describe: "Comma-separated list of fields to include",
          coerce: (fields) =>
            fields ? fields.split(",").map((f) => f.trim()) : null,
        });
    },
    async (argv) => {
      try {
        const cards = await findCards(argv);
        console.log(JSON.stringify(cards, null, 2));
      } catch (error) {
        console.error("Failed to find cards:", error.message);
      }
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;
