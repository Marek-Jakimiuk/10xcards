import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import type { SuggestionViewModel } from '../types';

interface FlashcardSuggestionItemProps {
  suggestion: SuggestionViewModel;
  onUpdate: (id: string, updatedData: { przod: string; tyl: string }) => void;
  onStatusChange: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<void>;
  isPending?: boolean;
}

export function FlashcardSuggestionItem({
  suggestion,
  onUpdate,
  onStatusChange,
  isPending = false,
}: FlashcardSuggestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrzod, setEditedPrzod] = useState(suggestion.przod);
  const [editedTyl, setEditedTyl] = useState(suggestion.tyl);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleSaveEdit = () => {
    onUpdate(suggestion.id, {
      przod: editedPrzod,
      tyl: editedTyl,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPrzod(suggestion.przod);
    setEditedTyl(suggestion.tyl);
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: 'approved' | 'rejected' | 'pending') => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(suggestion.id, newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusStyles = () => {
    switch (suggestion.status) {
      case 'approved':
        return 'border-green-500 bg-green-50';
      case 'rejected':
        return 'border-red-500 bg-red-50 opacity-50';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Card className={`border-2 ${getStatusStyles()} relative`}>
      {(isPending || isChangingStatus) && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      <CardContent className="pt-6 space-y-4">
        {isEditing ? (
          <>
            <Textarea
              value={editedPrzod}
              onChange={(e) => setEditedPrzod(e.target.value)}
              placeholder="Przód fiszki"
              className="min-h-[100px]"
            />
            <Textarea
              value={editedTyl}
              onChange={(e) => setEditedTyl(e.target.value)}
              placeholder="Tył fiszki"
              className="min-h-[100px]"
            />
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-semibold">Przód:</h3>
              <p className="text-gray-700">{suggestion.przod}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Tył:</h3>
              <p className="text-gray-700">{suggestion.tyl}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        {isEditing ? (
          <>
            <Button onClick={handleSaveEdit} variant="default">
              Zapisz
            </Button>
            <Button onClick={handleCancelEdit} variant="outline">
              Anuluj
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleStatusChange('approved')}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              disabled={suggestion.status === 'rejected' || isPending || isChangingStatus}
            >
              Zatwierdź
            </Button>
            <Button
              onClick={() => handleStatusChange('rejected')}
              variant="destructive"
              disabled={suggestion.status === 'approved' || isPending || isChangingStatus}
            >
              Odrzuć
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              disabled={suggestion.status !== 'pending' || isPending || isChangingStatus}
            >
              Edytuj
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
} 