const createProgressTable = `
CREATE TABLE IF NOT EXISTS Progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    weekly_progress INTEGER,
    daily_progress INTEGER,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES "User" (user_id)
);
`;

export default createProgressTable;