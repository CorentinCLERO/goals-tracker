CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    criteria TEXT
);

CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES users(id),
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

INSERT INTO badges (name, description, icon, criteria) VALUES 
('Finisher', 'Complétez 5 objectifs', '🏆', 'Complete 5 goals'),
('Commitment', 'Maintenez un streak de 30 jours sur une habitude', '💪', 'Maintain 30-day habit streak');