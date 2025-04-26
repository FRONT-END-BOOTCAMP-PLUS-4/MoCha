let refreshing: Promise<string | false> | null = null;

export async function refreshToken(): Promise<string | false> {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;

  if (!refreshing) {
    refreshing = fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
      .then((res) => res.json())
      .then((data) => {
        refreshing = null;
        if (!data.success) return false;
        localStorage.setItem('access_token', data.access_token);
        return data.access_token as string;
      })
      .catch(() => {
        refreshing = null;
        return false;
      });
  }

  return refreshing;
}
