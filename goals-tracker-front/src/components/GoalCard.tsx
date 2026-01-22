import type { Goal } from '../types';
import { useGoalProgress } from '../hooks/useGoals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Calendar, Eye } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onView: (goal: Goal) => void;
  onComplete: (goal: Goal) => void;
}

export function GoalCard({ goal, onView, onComplete }: GoalCardProps) {
  const { progress, loading: progressLoading } = useGoalProgress(goal.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'abandoned': return 'Abandoned';
      default: return status;
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{goal.title}</CardTitle>
          <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white border-0 shrink-0`}>
            {goal.priority}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {goal.description || 'No description'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{progressLoading ? 'Loading...' : `${progress}%`}</span>
          </div>
          <Progress value={progressLoading ? 0 : progress} className="h-2" />
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getStatusColor(goal.status)}>
              {formatStatus(goal.status)}
            </Badge>
            <Badge variant="outline">{goal.category}</Badge>
          </div>

          {goal.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(goal)}
            className="flex-1"
          >
            <Eye className="size-4 mr-2" />
            View
          </Button>
          {goal.status === 'completed' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onComplete(goal)}
              className="flex-1"
            >
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}