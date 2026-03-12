import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth-context';

export function AuthDialog() {
  const { login, register } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action: 'login' | 'register', form: FormData) => {
    setError('');
    setLoading(true);

    try {
      if (action === 'login') {
        const email = form.get('email') as string;
        const password = form.get('password') as string;
        await login(email, password);
      } else {
        const username = form.get('username') as string;
        const email = form.get('email') as string;
        const password = form.get('password') as string;
        await register(username, email, password);
      }
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'border-amber-300 focus-visible:ring-amber-400';
  const labelClass = 'text-amber-900';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-400 text-amber-900 hover:bg-amber-200">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-amber-300" style={{ backgroundColor: '#fffbeb' }}>
        <DialogHeader>
          <DialogTitle>Welcome, Treasure Hunter!</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" onValueChange={() => setError('')}>
          <TabsList className="w-full bg-amber-100">
            <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-900">Login</TabsTrigger>
            <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-900">Register</TabsTrigger>
          </TabsList>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <TabsContent value="login">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('login', new FormData(e.currentTarget)); }}>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="login-email" className={labelClass}>Email</Label>
                  <Input id="login-email" name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <Label htmlFor="login-password" className={labelClass}>Password</Label>
                  <Input id="login-password" name="password" type="password" required className={inputClass} />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('register', new FormData(e.currentTarget)); }}>
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="reg-username" className={labelClass}>Username</Label>
                  <Input id="reg-username" name="username" required className={inputClass} />
                </div>
                <div>
                  <Label htmlFor="reg-email" className={labelClass}>Email</Label>
                  <Input id="reg-email" name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <Label htmlFor="reg-password" className={labelClass}>Password</Label>
                  <Input id="reg-password" name="password" type="password" required className={inputClass} />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
