import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: 'Success!',
      description: 'You have been logged out.',
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Tasty Order Delight
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/menu" className="hover:text-primary transition-colors">
              Menu
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Cart
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Welcome, {user.name}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-background">
        {children}
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Tasty Order Delight brings you the finest dining experience at your doorstep.
                Enjoy our wide selection of delicious meals prepared by expert chefs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/menu" className="hover:text-primary transition-colors">
                    Our Menu
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: info@tastyorderdelight.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Food Street, Cuisine City, FC 12345</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tasty Order Delight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 