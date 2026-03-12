import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { apiFetch } from '@/lib/api';

interface Score {
  score: number;
  result: string;
  played_at: string;
}

export function ScoreHistory() {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (open) {
      apiFetch('/api/scores').then(data => setScores(data.scores)).catch(() => {});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-400 text-amber-900 hover:bg-amber-200">
          Score History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-amber-300" style={{ backgroundColor: '#fffbeb' }}>
        <DialogHeader>
          <DialogTitle>Score History</DialogTitle>
        </DialogHeader>
        {scores.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No games played yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Result</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {s.result === 'win' ? '🏆 Win' : s.result === 'tie' ? '🤝 Tie' : '💀 Loss'}
                    </TableCell>
                    <TableCell className={s.score >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${s.score}
                    </TableCell>
                    <TableCell>{new Date(s.played_at + 'Z').toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
