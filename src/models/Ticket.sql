CREATE TABLE tickets (
    guildID VARCHAR(255) NOT NULL,
    channelID VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    userID VARCHAR(255),
    state VARCHAR(255) NOT NULL,
    createdAt DATE,
    deletedAT DATE
);