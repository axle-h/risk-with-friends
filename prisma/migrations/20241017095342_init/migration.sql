-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seed" INTEGER NOT NULL,
    "dateStarted" DATETIME NOT NULL,
    "dateUpdated" DATETIME NOT NULL,
    "currentPlayerOrdinal" INTEGER NOT NULL,
    "winningPlayerOrdinal" INTEGER
);

-- CreateTable
CREATE TABLE "GamePlayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordinal" INTEGER NOT NULL,
    "playerOrdinal" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "GameAction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeployAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "territory" TEXT NOT NULL,
    "armies" INTEGER NOT NULL,
    CONSTRAINT "DeployAction_id_fkey" FOREIGN KEY ("id") REFERENCES "GameAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttackAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "territoryFrom" TEXT NOT NULL,
    "territoryTo" TEXT NOT NULL,
    "attackingDice" INTEGER NOT NULL,
    CONSTRAINT "AttackAction_id_fkey" FOREIGN KEY ("id") REFERENCES "GameAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OccupyAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "armies" INTEGER NOT NULL,
    CONSTRAINT "OccupyAction_id_fkey" FOREIGN KEY ("id") REFERENCES "GameAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FortifyAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "territoryFrom" TEXT NOT NULL,
    "territoryTo" TEXT NOT NULL,
    "armies" INTEGER NOT NULL,
    CONSTRAINT "FortifyAction_id_fkey" FOREIGN KEY ("id") REFERENCES "GameAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TurnInCardsAction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "card1" TEXT NOT NULL,
    "card2" TEXT NOT NULL,
    "card3" TEXT NOT NULL,
    CONSTRAINT "TurnInCardsAction_id_fkey" FOREIGN KEY ("id") REFERENCES "GameAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GameAction_gameId_ordinal_key" ON "GameAction"("gameId", "ordinal");
