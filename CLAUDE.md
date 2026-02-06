# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a security research project demonstrating vulnerabilities in Nepal's Election Commission voter list website. It scrapes publicly accessible voter data to highlight privacy and security concerns with the official system.

## Commands

Run the complete pipeline (must execute in order):
```bash
bun run clone
```

Or run individual steps:
```bash
bun run clone-districts    # Step 1: Fetch all districts (states 1-7)
bun run clone-vdcs         # Step 2: Fetch VDCs/municipalities per district
bun run clone-wards        # Step 3: Fetch wards per VDC
bun run clone-voting-centres  # Step 4: Fetch voting centres per ward
bun run clone-voter-list   # Step 5: Fetch voter records per centre
```

Each step depends on the previous step's output in `./data/`.

## Architecture

The scraper follows Nepal's administrative hierarchy: State -> District -> VDC/Municipality -> Ward -> Voting Centre -> Voters.

**Core modules:**
- `src/region.ts` - Fetches dropdown options (districts, VDCs, wards, centres) from the election website's AJAX endpoint
- `src/voters.ts` - Fetches and parses voter records from HTML tables

**Pipeline scripts** (`src/clone*.ts`):
- Each script reads the previous step's JSON from `./data/`, fetches the next level of data, and writes results
- `cloneVoterList.ts` flushes to numbered files (`voterList0.json`, `voterList1.json`, etc.) every 10,000 records

**Data flow:**
```
districts.json -> vdcs.json -> wards.json -> votingCentres.json -> voterList*.json
```

## Runtime

Uses Bun for TypeScript execution and file I/O (`Bun.file()`, `Bun.write()`).
