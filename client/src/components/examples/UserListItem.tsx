import UserListItem from '../UserListItem';

export default function UserListItemExample() {
  return (
    <div className="p-4 space-y-2">
      <UserListItem username="Алексей" onCall={() => console.log('Call Алексей')} />
      <UserListItem username="Мария" onCall={() => console.log('Call Мария')} />
      <UserListItem username="Дмитрий" onCall={() => console.log('Call Дмитрий')} />
    </div>
  );
}
