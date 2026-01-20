CREATE TABLE goals
(
    id           UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    category     VARCHAR(100),
    priority     VARCHAR(20)  NOT NULL    DEFAULT 'MEDIUM',
    status       VARCHAR(20)  NOT NULL    DEFAULT 'ACTIVE',
    start_date   TIMESTAMP WITH TIME ZONE,
    deadline     TIMESTAMP WITH TIME ZONE,
    user_id      UUID         NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT check_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT check_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABANDONED'))
);