CREATE TABLE steps
(
    id           UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    title        VARCHAR(255) NOT NULL,
    deadline     TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    order_by     INT NOT NULL,
    goal_id      UUID NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_goals_user FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
);