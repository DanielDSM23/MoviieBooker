
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-cinema-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl">{user.username}</CardTitle>
          <CardDescription className="text-center">Membre de MoovieBooker</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-3 border border-border rounded-md">
            <User className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Nom d'utilisateur</div>
              <div>{user.username}</div>
            </div>
          </div>
          <div className="flex items-center p-3 border border-border rounded-md">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div>{user.email}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
