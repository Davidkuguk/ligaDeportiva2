import { Collection, Db, OptionalId } from 'mongodb';

import { LIGA_SEED_DATA, LigaSeedData } from '../app/ligaDeportiva/data/liga.seed';

type CollectionName = keyof LigaSeedData;

type LigaDocumentMap = {
  [K in CollectionName]: LigaSeedData[K][number];
};

function getCollection<K extends CollectionName>(
  db: Db,
  name: K,
): Collection<OptionalId<LigaDocumentMap[K]>> {
  return db.collection<OptionalId<LigaDocumentMap[K]>>(name);
}

export async function getLigaDataFromDatabase(db: Db): Promise<LigaSeedData> {
  const [news, results, teams, standings, players, referees] = await Promise.all([
    getCollection(db, 'news').find().toArray(),
    getCollection(db, 'results').find().toArray(),
    getCollection(db, 'teams').find().toArray(),
    getCollection(db, 'standings').find().toArray(),
    getCollection(db, 'players').find().toArray(),
    getCollection(db, 'referees').find().toArray(),
  ]);

  return {
    news: news.map(stripMongoId),
    results: results.map(stripMongoId),
    teams: teams.map(stripMongoId),
    standings: standings.map(stripMongoId),
    players: players.map(stripMongoId),
    referees: referees.map(stripMongoId),
  };
}

export async function seedLigaData(db: Db): Promise<void> {
  const collectionNames = Object.keys(LIGA_SEED_DATA) as CollectionName[];

  await Promise.all(
    collectionNames.map(async (collectionName) => {
      const collection = getCollection(db, collectionName);
      await collection.deleteMany({});
      await collection.insertMany(LIGA_SEED_DATA[collectionName]);
    }),
  );
}

function stripMongoId<T extends { _id?: unknown }>(document: T): Omit<T, '_id'> {
  const { _id: _ignored, ...rest } = document;
  return rest;
}
