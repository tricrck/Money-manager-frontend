function AuthErrorPage() {
  return (
    <div>
      <h2>Authentication Failed</h2>
      <p>We couldn’t log you in with Google. Please try again.</p>
      <a href="/login">Back to login</a>
    </div>
  );
}
export default AuthErrorPage;