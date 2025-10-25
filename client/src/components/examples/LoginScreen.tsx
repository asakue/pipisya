import LoginScreen from '../LoginScreen';

export default function LoginScreenExample() {
  return <LoginScreen onJoin={(username) => console.log('Joining as:', username)} />;
}
