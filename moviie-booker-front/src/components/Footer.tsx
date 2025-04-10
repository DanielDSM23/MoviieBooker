
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-cinema-primary" />
              <span className="text-xl font-bold">MoovieBooker</span>
            </div>
            <p className="mt-4 text-muted-foreground max-w-md">
              Votre plateforme de réservation de films, simple et efficace. Trouvez les meilleurs films et réservez vos places en quelques clics.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                    Films
                  </Link>
                </li>
                <li>
                  <Link to="/reservations" className="text-muted-foreground hover:text-primary transition-colors">
                    Réservations
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Compte</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                    Inscription
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                    Profil
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  contact@mooviebooker.com
                </li>
                <li className="text-muted-foreground">
                  +33 1 23 45 67 89
                </li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MoovieBooker. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
