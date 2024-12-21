# Anki Connect CLI

A command-line interface tool for interacting with Anki through the AnkiConnect API. Easily manage your Anki cards, decks, and notes directly from the terminal.

## Installation

```bash
npm install -g anki-connect-cli
```

Ensure AnkiConnect plugin is installed in Anki and Anki is running.

## Usage

### Finding Cards

```bash
# Basic search
ankicli find "deck:current"

# Filter by specific fields
ankicli find "deck:Japanese" --fields note,tags

# Complex queries
ankicli find "deck:Japanese tag:vocab -is:new" --fields note,tags,due
```

### Adding Cards

```bash
# Add a single card
ankicli add "Front content" "Back content" --deck "MyDeck"

# Add with tags
ankicli add "Question" "Answer" --deck "MyDeck" --tags "vocab,new"

# Add with custom note type
ankicli add "Term" "Definition" --deck "MyDeck" --note-type "Basic (reverse)"
```

### Moving Cards

```bash
# Move cards between decks
ankicli move "deck:source" "TargetDeck"

# Move with query
ankicli move "deck:Japanese tag:N5" "Japanese::N5"
```

## Filter Options

- `deck:name` - Filter by deck name
- `tag:name` - Filter by tag
- `-tag:name` - Exclude tag
- `is:new/due/review` - Card state
- `prop:value` - Custom property filter
- `*` - Wildcard searches

## Available Fields

- `nid` - Note ID
- `cid` - Card ID
- `note` - Note content
- `deck` - Deck name
- `tags` - Card tags
- `due` - Due date
- `ivl` - Interval
- `ease` - Ease factor
- `type` - Card type
- `queue` - Card queue
