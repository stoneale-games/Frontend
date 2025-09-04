export const TournamentList = () => {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Upcoming Tournaments</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>The Weekend Warrior - Sat @ 8:00 PM</li>
                <li>High Roller Monday - Mon @ 9:00 PM</li>
                <li>The Daily Dash - Today @ 5:00 PM (Registration Open)</li>
            </ul>
        </div>
    );
};