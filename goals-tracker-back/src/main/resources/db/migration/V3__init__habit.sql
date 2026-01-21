DROP TABLE IF EXISTS habit CASCADE;
DROP TYPE IF EXISTS habit_frequency;
CREATE TABLE habit(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency VARCHAR(20) NOT NULL, 
    weekly_target INTEGER,
    category VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES users(id)
      ON DELETE CASCADE,

    CONSTRAINT check_weekly_target 
      CHECK (
        (frequency = 'DAILY') OR 
        (frequency = 'WEEKLY' AND weekly_target IS NOT NULL)
      )

)
