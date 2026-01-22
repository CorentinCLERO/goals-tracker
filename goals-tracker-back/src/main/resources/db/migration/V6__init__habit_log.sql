CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),    
    habit_id UUID NOT NULL,
    
    date DATE NOT NULL,
    
    is_completed BOOLEAN DEFAULT TRUE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_habit_date UNIQUE (habit_id, date),
    
    CONSTRAINT fk_habit 
        FOREIGN KEY (habit_id) 
        REFERENCES habit(id) 
        ON DELETE CASCADE
);

