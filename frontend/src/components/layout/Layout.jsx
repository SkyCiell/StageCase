import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

const Layout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <PageTransition>{children}</PageTransition>
    </main>
    {!hideFooter && <Footer />}
  </div>
);

export default Layout;
