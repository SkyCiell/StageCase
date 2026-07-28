import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import MusicPlayer from '../player/MusicPlayer';

const Layout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col bg-background text-text-primary">
    <Navbar />
    <main className="flex-1">
      <PageTransition>{children}</PageTransition>
    </main>
    <MusicPlayer />
    {!hideFooter && <Footer />}
  </div>
);

export default Layout;
