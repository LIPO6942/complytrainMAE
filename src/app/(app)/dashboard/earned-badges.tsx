'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/firebase';
import { allBadges } from '@/lib/data';
import { Award } from 'lucide-react';

export function EarnedBadges() {
    const { userProfile } = useUser();
    const earnedBadgeIds = userProfile?.badges || [];
    const earnedBadges = allBadges.filter(badge => earnedBadgeIds.includes(badge.id));

    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-primary" />
              <span>Badges Obtenus</span>
            </CardTitle>
            <CardDescription>
              Votre collection de jalons de conformité terminés.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {earnedBadges.length > 0 ? (
                earnedBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                        <div key={badge.id} className="flex flex-col items-center gap-2 text-center w-24">
                        {Icon ? (
                            <Icon className="w-16 h-16 text-green-700" />
                        ) : (
                            <Award className="w-16 h-16 text-muted-foreground" />
                        )}
                        <div className="space-y-1">
                            <p className="font-semibold text-sm leading-tight">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-sm text-muted-foreground">Aucun badge obtenu pour le moment. Terminez des tests pour en gagner !</p>
            )}
          </CardContent>
        </Card>
    )
}
